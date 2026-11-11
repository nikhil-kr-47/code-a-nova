/**
 * Email templates for Code-a-Nova Hackathon Registration Portal
 * Note: Sender name is strictly "Code-a-Nova". No candidate or personal sender name is included.
 */

export const getOtpEmailTemplate = (otp) => {
  return {
    subject: `Your Code-a-Nova Verification Code: ${otp}`,
    text: `Welcome to Code-a-Nova!\n\nYour 6-digit account verification code is: ${otp}\n\nThis code will expire in 10 minutes. Please do not share this code with anyone.\n\nBest regards,\nCode-a-Nova Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: #4f46e5; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px; }
          .content { padding: 32px 28px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
          .otp-code { font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; }
          .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Code-a-Nova</h1>
            <p>Annual National Hackathon 2026</p>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Verify Your Email Address</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Thank you for starting your registration for <strong>Code-a-Nova</strong>. Please use the following 6-digit verification code to complete your signup process.
            </p>
            <div class="otp-box">
              <span class="otp-code">${otp}</span>
            </div>
            <p style="font-size: 13px; color: #dc2626; margin-bottom: 0;">
              ⚠️ This code will expire in <strong>10 minutes</strong>. Never disclose this OTP to anyone.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This email was sent automatically by <strong>Code-a-Nova</strong>.</p>
            <p style="margin: 4px 0 0 0;">If you did not request this verification, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

export const getRegistrationEmailTemplate = ({
  fullName,
  registrationId,
  projectName,
  domainTrack,
  collegeName,
  teamSize,
  teamMembers,
}) => {
  const membersHtml =
    teamSize > 1 && teamMembers && teamMembers.length > 0
      ? `
        <div style="margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #64748b;">Team Members (${teamMembers.length})</h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 14px; color: #334155;">
            ${teamMembers.map((m) => `<li style="margin-bottom: 4px;"><strong>${m.name}</strong> (${m.email})</li>`).join('')}
          </ul>
        </div>
      `
      : `<p style="margin: 12px 0 0 0; font-size: 14px; color: #64748b;">Solo Participation (1 Member)</p>`;

  return {
    subject: `Registration Confirmed: Code-a-Nova 2026 [${registrationId}]`,
    text: `Hello ${fullName},\n\nYour registration for Code-a-Nova Hackathon 2026 has been successfully confirmed!\n\nRegistration ID: ${registrationId}\nProject Name: ${projectName}\nDomain/Track: ${domainTrack}\nCollege: ${collegeName}\nTeam Size: ${teamSize}\n\nWe look forward to seeing your project come to life.\n\nBest regards,\nCode-a-Nova Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: #0f172a; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: #4f46e5; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 8px; }
          .content { padding: 32px 28px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .label { color: #64748b; font-weight: 500; }
          .value { color: #0f172a; font-weight: 600; }
          .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Code-a-Nova 2026</h1>
            <div class="badge">Official Confirmation</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Congratulations, ${fullName}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your entry for the <strong>Code-a-Nova Hackathon</strong> has been successfully registered in our portal. Here are your registration details:
            </p>
            <div class="card">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Registration ID:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #4f46e5; text-align: right;">${registrationId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Project Title:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Domain / Track:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${domainTrack}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Institution:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${collegeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Team Size:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${teamSize}</td>
                </tr>
              </table>
              ${membersHtml}
            </div>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Please keep your Registration ID <strong>${registrationId}</strong> handy for project evaluation, team check-in, and the grand finale.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">Sent by <strong>Code-a-Nova</strong> | National Student Hackathon</p>
            <p style="margin: 4px 0 0 0;">For inquiries, reply directly to this email or reach us through the portal.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
