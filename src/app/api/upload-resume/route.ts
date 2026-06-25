import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_1;
const MODEL = "openai/gpt-oss-120b:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// ---------------------------------------------------------------------------
// Lightweight text extractor — works for plain PDFs and DOCX without native
// binaries.  Install: npm i pdf-parse mammoth
// ---------------------------------------------------------------------------
async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      // pdf-parse ESM: the parse function is the module itself
      const pdfParseModule = await import("pdf-parse");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse: (buf: Buffer) => Promise<{ text: string }> = (pdfParseModule as any).default ?? pdfParseModule;
      const result = await pdfParse(buffer);
      return result.text || "";
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
  } catch (err) {
    console.error("Text extraction error:", err);
  }
  return "";
}

// ---------------------------------------------------------------------------
// Call OpenRouter for structured resume evaluation
// ---------------------------------------------------------------------------
async function evaluateResume(resumeText: string): Promise<Record<string, unknown>> {
  const systemPrompt = `You are a senior recruiter and career coach with deep expertise in evaluating resumes.
Analyze the provided resume text and return a structured JSON evaluation with the following schema:
{
  "overall_score": <number 0-100>,
  "ats_score": <number 0-100>,
  "summary": "<2-3 sentence overview>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "skills": {
    "technical": ["<skill>", ...],
    "soft": ["<skill>", ...]
  },
  "experience_years": <number or null>,
  "education": "<highest degree or null>",
  "suggested_roles": ["<role 1>", "<role 2>", ...],
  "gap_analysis": [
    {
      "category": "<category>",
      "gap": "<description>",
      "recommendation": "<actionable recommendation>"
    }
  ],
  "keyword_density": {
    "found": ["<keyword>", ...],
    "missing": ["<keyword>", ...]
  },
  "formatting_feedback": "<feedback on resume structure and formatting>",
  "action_items": ["<item 1>", "<item 2>", ...]
}
Return ONLY the JSON object, no markdown fences, no extra text.`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://reevalve.app",
      "X-Title": "reevalve Resume Evaluator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please evaluate the following resume:\n\n${resumeText.slice(0, 12000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content: string =
    data?.choices?.[0]?.message?.content ?? "{}";

  try {
    // Strip potential markdown fences if the model adds them
    const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    console.error("JSON parse error from LLM:", content);
    return { raw_response: content };
  }
}

// ---------------------------------------------------------------------------
// POST /api/upload-resume
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // -- Auth ----------------------------------------------------------------
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // -- File validation -----------------------------------------------------
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // -- Upload to Supabase Storage ------------------------------------------
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${Date.now()}_${sanitizedName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // -- Insert initial DB row (status = processing) -------------------------
    const { data: resumeRow, error: insertError } = await supabaseAdmin
      .from("resumes")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        status: "processing",
      })
      .select()
      .single();

    if (insertError || !resumeRow) {
      console.error("DB insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save resume record" },
        { status: 500 }
      );
    }

    const resumeId: string = resumeRow.id;

    // -- Extract text from the file -----------------------------------------
    const rawText = await extractText(buffer, file.type);

    // -- AI evaluation -------------------------------------------------------
    let evaluation: Record<string, unknown> = {};
    let finalStatus = "evaluated";
    let errorMessage: string | null = null;

    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_1 environment variable is not set");
      }
      if (!rawText.trim()) {
        throw new Error(
          "Could not extract text from the uploaded file. Please ensure the PDF/DOCX is not scanned image-only."
        );
      }
      evaluation = await evaluateResume(rawText);
    } catch (aiErr: unknown) {
      console.error("AI evaluation error:", aiErr);
      finalStatus = "error";
      errorMessage =
        aiErr instanceof Error ? aiErr.message : "AI evaluation failed";
    }

    // -- Persist evaluation to DB -------------------------------------------
    await supabaseAdmin
      .from("resumes")
      .update({
        raw_text: rawText || null,
        evaluation: Object.keys(evaluation).length > 0 ? evaluation : null,
        status: finalStatus,
        error_message: errorMessage,
      })
      .eq("id", resumeId);

    // -- Also keep users.updated_at in sync ---------------------------------
    await supabaseAdmin
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      resumeId,
      storagePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      status: finalStatus,
      evaluation: Object.keys(evaluation).length > 0 ? evaluation : null,
      error: errorMessage,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
