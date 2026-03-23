import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendOtpEmail = async (to, otp, purpose) => {
  const isReset = purpose === "reset_password";

  const subject = isReset
    ? "ApexMDS Password Reset Verification"
    : "Verify Your ApexMDS Account";

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc; padding: 24px;">
      <div style="max-width: 520px; margin: auto; background-color: #ffffff; padding: 28px; border-radius: 8px; border: 1px solid #e5e7eb;">
        
        <h2 style="color: #0f172a; margin-bottom: 8px;">
          ${isReset ? "Reset Your Password" : "Verify Your Email Address"}
        </h2>

        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Hello,
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          ${
            isReset
              ? "We received a request to reset your ApexMDS account password."
              : "Thank you for registering with ApexMDS, your NEET MDS preparation companion."
          }
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Please use the verification code below to continue:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #1e3a8a;">
            ${otp}
          </span>
        </div>

        <p style="color: #334155; font-size: 13px;">
          ⏱ This code is valid for <b>10 minutes</b>.  
          Please do not share this OTP with anyone.
        </p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="color: #64748b; font-size: 12px; line-height: 1.6;">
          If you did not initiate this request, you can safely ignore this email.
        </p>

        <p style="color: #64748b; font-size: 12px; margin-top: 16px;">
          Regards,<br />
          <b>ApexMDS Team</b><br />
          NEET MDS Preparation Platform
        </p>
      </div>
    </div>
  `;

  // Development mode → log OTP
  if (process.env.NODE_ENV === "development") {
    console.log(`📧 OTP for ${to}: ${otp}`);
    return;
  }

  await axios.post(
    BREVO_API_URL,
    {
      sender: {
        name: "ApexMDS",
        email: process.env.EMAIL_FROM.match(/<(.*)>/)[1]
      },
      to: [{ email: to }],
      subject,
      htmlContent
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
};
