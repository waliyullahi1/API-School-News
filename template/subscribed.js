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



function renderNewsBroadcastTemplate({
  name = "Subscriber",
  newsTitle = "Latest School Update",
  summary = "We've published a new update for you on Abanise News.",
  imageUrl = "",
  articleUrl = "https://news.abaniseedu.com",
  category = "Education News",
  supportEmail = "support@abanise.com",
  companyName = "Abanise News",
  companyWebsite = "https://news.abaniseedu.com",
  year = new Date().getFullYear()
} = {}) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:40px 15px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<tr>
<td align="center">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;">

${
  imageUrl
    ? `
<tr>
<td style="padding:0;">
<img
src="${imageUrl}"
alt="${newsTitle}"
style="display:block;width:100%; height:250px ;border:0;">
</td>
</tr>
`
    : ""
}

<tr>
<td style="padding:10px 10px;">

<span style="
display:inline-block;
background:#164b3b;
color:#ffffff;
padding:7px 16px;
font-size:12px;
font-weight:bold;
border-radius:30px;
letter-spacing:.3px;">
${category}
</span>

<h1 style="
margin:24px 0 18px;
font-size:30px;
line-height:1.15;
font-weight:800;
color:#1f2937;">
${newsTitle}
</h1>

<p style="
margin:0;
font-size:17px;
line-height:1.8;
color:#4b5563;">
Hello <strong>${name}</strong>,
</p>

<p style="
margin:18px 0;
font-size:16px;
line-height:1.9;
color:#4b5563;">
${summary}
</p>

<p style="
margin:0 0 32px;
font-size:16px;
line-height:1.9;
color:#4b5563;">
Stay informed with the latest education news, admission updates,
JAMB information, Post-UTME announcements, WAEC, NECO,
scholarships, recruitment opportunities and other important school
updates published daily on <strong>${companyName}</strong>.
</p>

<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td bgcolor="#164b3b" style="border-radius:8px;">
<a
href="${articleUrl}"
target="_blank"
style="
display:inline-block;
padding:16px 34px;
font-size:16px;
font-weight:bold;
color:#ffffff;
text-decoration:none;">
Read Full Story →
</a>
</td>
</tr>
</table>

</td>
</tr>

<tr>
<td style="padding:0 36px;">
<hr style="border:none;border-top:1px solid #e5e7eb;">
</td>
</tr>

<tr>
<td style="padding:30px 36px;background:#fafafa;">

<h3 style="
margin:0 0 14px;
font-size:18px;
color:#111827;">
About ${companyName}
</h3>

<p style="
margin:0;
font-size:14px;
line-height:1.8;
color:#6b7280;">
${companyName} is a trusted education news platform dedicated to
providing students, parents, teachers and institutions with reliable
updates on admissions, examinations, scholarships, recruitment,
university news, educational policies and other important academic
information across Nigeria.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
<tr>

<td width="33%" align="center">
<div style="font-size:24px;">🎓</div>
<div style="margin-top:8px;font-size:13px;color:#555;">
Admission Updates
</div>
</td>

<td width="33%" align="center">
<div style="font-size:24px;">📰</div>
<div style="margin-top:8px;font-size:13px;color:#555;">
Daily Education News
</div>
</td>

<td width="33%" align="center">
<div style="font-size:24px;">📚</div>
<div style="margin-top:8px;font-size:13px;color:#555;">
Exam Information
</div>
</td>

</tr>
</table>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="
margin:0;
font-size:13px;
line-height:1.8;
color:#6b7280;
text-align:center;">
You're receiving this email because you subscribed to updates from
<strong>${companyName}</strong>.
</p>

<p style="
margin:14px 0 0;
font-size:13px;
line-height:1.8;
color:#6b7280;
text-align:center;">
Website:
<a href="${companyWebsite}" style="color:#164b3b;text-decoration:none;">
${companyWebsite}
</a>
</p>

<p style="
margin:8px 0 0;
font-size:13px;
line-height:1.8;
color:#6b7280;
text-align:center;">
Support:
<a href="mailto:${supportEmail}" style="color:#164b3b;text-decoration:none;">
${supportEmail}
</a>
</p>

<p style="
margin:20px 0 0;
font-size:12px;
color:#9ca3af;
text-align:center;">
© ${year} ${companyName}. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>
`;
}




module.exports = {
  renderNewsletterSubscriptionTemplate,
  renderNewsBroadcastTemplate,
}