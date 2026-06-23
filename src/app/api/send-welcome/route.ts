import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const displayName = name || email.split("@")[0];

    await transporter.sendMail({
      from: `"reevalve" <${process.env.BREVO_SMTP_LOGIN}>`,
      to: email,
      subject: "Welcome to reevalve — Your career coordinates are set.",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Welcome to reevalve</title>
        </head>
        <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,98,254,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F62FE 0%,#034ad9 100%);padding:40px 48px;">
                      <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">reevalve</p>
                      <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.6);font-family:monospace;letter-spacing:2px;">SYSTEM OPERATIONAL: VERSION 4.0 ACTIVE</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:48px;">
                      <p style="margin:0 0 8px;font-size:13px;color:#0F62FE;font-weight:700;font-family:monospace;letter-spacing:1px;">COORDINATES LOCKED</p>
                      <h1 style="margin:0 0 24px;font-size:28px;font-weight:800;color:#0F172A;line-height:1.2;">Welcome aboard, ${displayName}.</h1>
                      <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.7;">
                        You've just activated your <strong style="color:#0F172A;">reevalve</strong> career intelligence system. We're here to help you map your gaps, align to the right roles, and build your proof-of-capability — one step at a time.
                      </p>
                      <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
                        Here's what you can do right now:
                      </p>
                      <!-- Feature list -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td style="padding:12px 16px;background:#EBF2FF;border-radius:8px;margin-bottom:8px;display:block;">
                            <p style="margin:0;font-size:13px;font-weight:700;color:#0F62FE;">📄 Resume Gap Analysis</p>
                            <p style="margin:4px 0 0;font-size:12px;color:#64748B;">Upload your resume and get a precise skills map</p>
                          </td>
                        </tr>
                        <tr><td style="height:8px;"></td></tr>
                        <tr>
                          <td style="padding:12px 16px;background:#F0FDF4;border-radius:8px;display:block;">
                            <p style="margin:0;font-size:13px;font-weight:700;color:#10B981;">🎯 Daily Mock Simulations</p>
                            <p style="margin:4px 0 0;font-size:12px;color:#64748B;">Sharpen your PM and strategy instincts daily</p>
                          </td>
                        </tr>
                        <tr><td style="height:8px;"></td></tr>
                        <tr>
                          <td style="padding:12px 16px;background:#FFF7ED;border-radius:8px;display:block;">
                            <p style="margin:0;font-size:13px;font-weight:700;color:#F97316;">✉️ Recruiter Outreach Builder</p>
                            <p style="margin:4px 0 0;font-size:12px;color:#64748B;">Craft targeted outreach for every role</p>
                          </td>
                        </tr>
                      </table>
                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                        <tr>
                          <td style="background:#0F62FE;border-radius:10px;">
                            <a href="https://reevalve.vercel.app" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
                              Start Analyzing →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6;">
                        This is an automated message from reevalve. If you didn't sign up, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 48px;border-top:1px solid #E2E8F0;">
                      <p style="margin:0;font-size:11px;color:#CBD5E1;font-family:monospace;">
                        SYS.STATUS: ONLINE // © ${new Date().getFullYear()} reevalve Inc. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
