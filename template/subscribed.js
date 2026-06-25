 function renderNewsletterSubscriptionTemplate({
  name = "Subscriber",
  supportEmail = "support@abanise.com",
  year = new Date().getFullYear()
} = {}) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 18px rgba(20,20,20,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding:24px; background:#164b3b; color:#ffffff; text-align:center;">
              <h1 style="margin:0; font-size:24px; font-weight:700;">Abanise News</h1>
              <p style="margin:8px 0 0; font-size:14px; color:#dfeee8;">
                School News • Admission Updates • JAMB • Post-UTME • Scholarships
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 28px; color:#333333; font-size:15px; line-height:1.7;">
              <p style="margin-top:0;">Hi <strong>${name}</strong>,</p>

              <p>
                Thank you for subscribing to <strong>Abanise News</strong>.
              </p>

              <p>
                You will now receive updates on the latest <strong>school news</strong>, including admission updates,
                JAMB news, Post-UTME information, O'level updates, scholarships, and other important education-related announcements.
              </p>

              <div style="margin:24px 0; padding:18px 20px; background:#f8fbfa; border-left:4px solid #dc352d; border-radius:8px;">
                <p style="margin:0; font-size:14px; color:#164b3b;">
                  Stay informed and never miss important school updates from Abanise News.
                </p>
              </div>

              <p>
                We’re glad to have you with us.
              </p>

              <p style="margin-bottom:0;">
                Best regards,<br />
                <strong style="color:#164b3b;">The Abanise News Team</strong>
              </p>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding:0 28px 24px;">
              <p style="margin:0; color:#666666; font-size:13px; line-height:1.6;">
                If you have any questions, contact us at
                <a href="mailto:${supportEmail}" style="color:#dc352d; text-decoration:none; font-weight:600;">${supportEmail}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 20px; background:#f8f8f8; text-align:center; color:#7b7b7b; font-size:12px; border-top:1px solid #eeeeee;">
              © ${year} Abanise News. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}


module.exports = {
  renderNewsletterSubscriptionTemplate
}