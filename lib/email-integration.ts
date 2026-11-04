/**
 * Email integration utilities for ApplyWise
 */

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
}

/**
 * Generate mailto link for email client
 */
export function generateMailtoLink(data: EmailData): string {
  const params = new URLSearchParams();
  
  if (data.cc) params.append('cc', data.cc);
  if (data.bcc) params.append('bcc', data.bcc);
  params.append('subject', data.subject);
  params.append('body', data.body);

  return `mailto:${data.to}?${params.toString()}`;
}

/**
 * Open email client with pre-filled data
 */
export function openEmailClient(data: EmailData): void {
  const link = generateMailtoLink(data);
  window.location.href = link;
}

/**
 * Email templates for common scenarios
 */
export const EmailTemplates = {
  /**
   * Follow-up email after application
   */
  followUpApplication: (companyName: string, position: string, yourName: string): EmailData => ({
    to: '',
    subject: `Following up on ${position} Application`,
    body: `Dear Hiring Manager,

I hope this email finds you well. I recently applied for the ${position} position at ${companyName} and wanted to follow up on my application status.

I am very excited about the opportunity to join your team and believe my skills and experience would be a great fit for this role.

Could you please provide an update on the next steps in the hiring process?

Thank you for your time and consideration.

Best regards,
${yourName}`,
  }),

  /**
   * Thank you email after interview
   */
  thankYouInterview: (
    interviewerName: string,
    companyName: string,
    position: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `Thank You - ${position} Interview`,
    body: `Dear ${interviewerName},

Thank you for taking the time to interview me for the ${position} position at ${companyName}. I enjoyed our conversation and learning more about the team and the role.

I am very enthusiastic about the opportunity to contribute to ${companyName}, and I believe my skills and experience align well with the position's requirements.

Please don't hesitate to reach out if you need any additional information from me.

I look forward to hearing from you about the next steps.

Best regards,
${yourName}`,
  }),

  /**
   * Accepting job offer
   */
  acceptOffer: (
    hiringManagerName: string,
    companyName: string,
    position: string,
    startDate: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `Accepting ${position} Offer - ${companyName}`,
    body: `Dear ${hiringManagerName},

I am delighted to formally accept the ${position} offer at ${companyName}.

Thank you for this wonderful opportunity. I am excited to join the team and contribute to the company's success.

As discussed, my start date will be ${startDate}. Please let me know if there are any documents or information you need from me before my start date.

Thank you again for this opportunity.

Best regards,
${yourName}`,
  }),

  /**
   * Declining job offer
   */
  declineOffer: (
    hiringManagerName: string,
    companyName: string,
    position: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `${position} Offer - ${companyName}`,
    body: `Dear ${hiringManagerName},

Thank you very much for offering me the ${position} position at ${companyName}. I truly appreciate the time and effort you and your team invested in the interview process.

After careful consideration, I have decided to pursue a different opportunity that aligns more closely with my current career goals.

This was a difficult decision, as I was impressed by ${companyName} and the team. I hope we might have the opportunity to work together in the future.

Thank you again for your consideration.

Best regards,
${yourName}`,
  }),

  /**
   * Request for feedback after rejection
   */
  requestFeedback: (
    hiringManagerName: string,
    companyName: string,
    position: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `Feedback Request - ${position} Application`,
    body: `Dear ${hiringManagerName},

Thank you for considering me for the ${position} role at ${companyName}. While I'm disappointed that I wasn't selected, I respect your decision.

I would greatly appreciate any feedback you could provide about my application or interview. Understanding areas where I can improve would be invaluable for my professional development.

Thank you for your time and consideration.

Best regards,
${yourName}`,
  }),

  /**
   * Networking/Informational interview request
   */
  networkingRequest: (
    contactName: string,
    companyName: string,
    yourName: string,
    context: string
  ): EmailData => ({
    to: '',
    subject: `Introduction and Coffee Chat Request`,
    body: `Dear ${contactName},

I hope this email finds you well. ${context}

I am very interested in ${companyName} and would love to learn more about your experience there. Would you be available for a brief virtual coffee chat in the coming weeks?

I promise to be respectful of your time and would be grateful for any insights you could share.

Thank you for considering my request.

Best regards,
${yourName}`,
  }),

  /**
   * Salary negotiation email
   */
  salaryNegotiation: (
    hiringManagerName: string,
    companyName: string,
    position: string,
    currentOffer: string,
    expectedSalary: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `${position} Offer Discussion`,
    body: `Dear ${hiringManagerName},

Thank you for the ${position} offer at ${companyName}. I am excited about the opportunity to join your team.

I would like to discuss the compensation package. Based on my research, experience, and the market rate for similar positions, I was hoping for a salary in the range of ${expectedSalary}.

I am very interested in this position and believe I would be a valuable addition to the team. I am confident we can reach an agreement that works for both parties.

Would you be available for a brief call to discuss this further?

Thank you for your understanding.

Best regards,
${yourName}`,
  }),

  /**
   * Following up on pending offer
   */
  offerFollowUp: (
    hiringManagerName: string,
    companyName: string,
    position: string,
    yourName: string
  ): EmailData => ({
    to: '',
    subject: `Following Up - ${position} Offer`,
    body: `Dear ${hiringManagerName},

I hope this email finds you well. I wanted to follow up on the ${position} offer from ${companyName}.

I remain very interested in this opportunity and would appreciate any updates on the timeline or next steps.

Please let me know if you need any additional information from me.

Thank you for your time.

Best regards,
${yourName}`,
  }),
};

/**
 * Copy email to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate email signature
 */
export function generateEmailSignature(
  name: string,
  title?: string,
  phone?: string,
  linkedin?: string,
  website?: string
): string {
  let signature = `Best regards,\n${name}`;
  
  if (title) signature += `\n${title}`;
  if (phone) signature += `\n📱 ${phone}`;
  if (linkedin) signature += `\n💼 ${linkedin}`;
  if (website) signature += `\n🌐 ${website}`;

  return signature;
}

/**
 * Parse email template with variables
 */
export function parseEmailTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extract email addresses from text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  return text.match(emailRegex) || [];
}

/**
 * Schedule email reminder (returns delay in milliseconds)
 */
export function calculateEmailReminderDelay(
  type: 'followup' | 'thankyou' | 'feedback',
  referenceDate: Date
): number {
  const now = Date.now();
  const reference = referenceDate.getTime();

  switch (type) {
    case 'thankyou':
      // 24 hours after interview
      return Math.max(0, reference + 24 * 60 * 60 * 1000 - now);
    case 'followup':
      // 1 week after application
      return Math.max(0, reference + 7 * 24 * 60 * 60 * 1000 - now);
    case 'feedback':
      // 3 days after rejection
      return Math.max(0, reference + 3 * 24 * 60 * 60 * 1000 - now);
    default:
      return 0;
  }
}
