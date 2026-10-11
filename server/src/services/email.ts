import { config } from '../config';
import { enquiriesRepo } from '../db/repo';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    if (config.emailProvider === 'resend' && config.resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.emailFrom,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resend delivery error:', errorText);
        return { success: false, error: errorText };
      }
      return { success: true };
    }

    // Default development fallback: Log email clearly to console
    console.log('\n======================================================');
    console.log(`[EMAIL DISPATCH - DEV SIMULATOR]`);
    console.log(`To: ${payload.to}`);
    console.log(`From: ${config.emailFrom}`);
    console.log(`Subject: ${payload.subject}`);
    console.log('------------------------------------------------------');
    console.log(payload.html.replace(/<[^>]*>?/gm, ' '));
    console.log('======================================================\n');

    return { success: true };
  } catch (err: any) {
    console.error('Email sending exception:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendEnquiryConfirmationEmail(enquiry: any) {
  const authorSubject = `[Aratha Publication] Publishing Enquiry Received: ${enquiry.referenceNumber}`;
  const authorHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #171717; line-height: 1.6;">
      <div style="background-color: #171717; color: #F8F5EF; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">ARATHA PUBLICATION</h1>
        <p style="margin: 4px 0 0; color: #B99A5B; font-size: 13px; text-transform: uppercase;">Your Story Deserves to Be Published</p>
      </div>
      <div style="padding: 32px 24px; background-color: #F8F5EF;">
        <h2 style="font-size: 20px; color: #171717;">Dear ${enquiry.fullName},</h2>
        <p>Thank you for entrusting your publishing project, <strong>"${enquiry.manuscriptTitle}"</strong>, to Aratha Publication.</p>
        <p>Your enquiry has been securely registered in our editorial intake system under the following reference:</p>
        <div style="background-color: #FFFFFF; border: 1px solid #E5DFD5; padding: 16px; margin: 20px 0; border-radius: 6px; text-align: center;">
          <span style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Enquiry Reference</span>
          <div style="font-size: 24px; font-weight: bold; color: #B99A5B; letter-spacing: 2px; margin-top: 4px;">${enquiry.referenceNumber}</div>
        </div>
        <h3 style="font-size: 16px; margin-top: 24px; border-bottom: 1px solid #E5DFD5; padding-bottom: 6px;">Next Steps</h3>
        <ol style="padding-left: 20px;">
          <li>Our senior editorial team will conduct an initial review within 3 to 5 business days.</li>
          <li>An assigned editor will contact you via email (${enquiry.email}) or phone (${enquiry.phone}) to schedule an initial consultation.</li>
          <li>We will provide an editorial assessment and publishing roadmap tailored to your goals.</li>
        </ol>
        <p style="margin-top: 24px; font-size: 14px; color: #525252;">If you need to update any details regarding this submission, please reply to this email quoting your reference <strong>${enquiry.referenceNumber}</strong>.</p>
        <p style="margin-top: 32px; font-size: 14px; color: #171717;">With literary regards,<br><strong>The Editorial Committee</strong><br>Aratha Publication</p>
      </div>
    </div>
  `;

  const staffSubject = `[New Enquiry] ${enquiry.referenceNumber} - ${enquiry.manuscriptTitle} (${enquiry.fullName})`;
  const staffHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171717;">
      <h2>New Publishing Enquiry Received</h2>
      <p><strong>Reference:</strong> ${enquiry.referenceNumber}</p>
      <p><strong>Author:</strong> ${enquiry.fullName} (${enquiry.email}, ${enquiry.phone}, ${enquiry.country})</p>
      <p><strong>Manuscript Title:</strong> ${enquiry.manuscriptTitle}</p>
      <p><strong>Genre:</strong> ${enquiry.genre}</p>
      <p><strong>Status:</strong> ${enquiry.manuscriptStatus}</p>
      <p><strong>Word Count:</strong> ${enquiry.estimatedWordCount || 'Not specified'}</p>
      <p><strong>Format:</strong> ${enquiry.preferredFormat || 'Not specified'}</p>
      <p><strong>Project Description:</strong> ${enquiry.projectDescription}</p>
      <p><a href="${config.appUrl}/admin/enquiries/${enquiry.id}">View in CRM Dashboard</a></p>
    </div>
  `;

  // Dispatch author receipt
  const authorRes = await sendEmail({ to: enquiry.email, subject: authorSubject, html: authorHtml });
  // Dispatch staff notification
  const staffRes = await sendEmail({ to: config.contactReceiverEmail, subject: staffSubject, html: staffHtml });

  // Record activity in enquiry history
  await enquiriesRepo.addActivity({
    id: `act-email-${Date.now()}`,
    enquiryId: enquiry.id,
    userId: null,
    activityType: 'email_sent',
    description: `Automated confirmation email dispatched to author (${authorRes.success ? 'Delivered' : 'Failed'}) and staff notice (${staffRes.success ? 'Delivered' : 'Failed'}).`,
    createdAt: new Date(),
  });
}
