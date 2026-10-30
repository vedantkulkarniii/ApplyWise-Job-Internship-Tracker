export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'follow-up' | 'thank-you' | 'inquiry' | 'networking';
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'follow-up-1',
    name: 'Application Follow-up',
    subject: 'Following Up on My Application for [Position]',
    category: 'follow-up',
    body: `Dear [Hiring Manager Name],

I hope this email finds you well. I recently submitted my application for the [Position] role at [Company Name] on [Date], and I wanted to follow up to reiterate my strong interest in this opportunity.

I am particularly excited about [specific aspect of the role or company], and I believe my experience in [relevant skills/experience] would make me a valuable addition to your team.

I would greatly appreciate the opportunity to discuss how my background and skills align with your needs. Please let me know if you need any additional information from my end.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Phone]
[Your Email]`,
  },
  {
    id: 'thank-you-1',
    name: 'Post-Interview Thank You',
    subject: 'Thank You for the Interview Opportunity',
    category: 'thank-you',
    body: `Dear [Interviewer Name],

Thank you for taking the time to speak with me yesterday about the [Position] role at [Company Name]. I truly enjoyed our conversation and learning more about the team and the exciting projects you're working on.

I'm even more enthusiastic about the opportunity to contribute to [specific project or initiative discussed]. The [specific detail from interview] particularly resonated with me, and I'm confident that my experience with [relevant skills] would allow me to make an immediate impact.

Please don't hesitate to reach out if you need any additional information. I look forward to the next steps in the process.

Thank you again for your time and consideration.

Best regards,
[Your Name]`,
  },
  {
    id: 'networking-1',
    name: 'Informational Interview Request',
    subject: 'Request for Informational Interview',
    category: 'networking',
    body: `Dear [Contact Name],

I hope this message finds you well. My name is [Your Name], and I'm currently [your situation - e.g., exploring opportunities in software engineering].

I came across your profile and was impressed by your work at [Company Name], particularly [specific achievement or project]. I would greatly appreciate the opportunity to learn from your experience and insights about [specific topic - e.g., the tech industry, career transitions, etc.].

Would you be open to a brief 15-20 minute virtual coffee chat in the coming weeks? I'm happy to work around your schedule.

Thank you for considering my request. I look forward to the possibility of connecting with you.

Best regards,
[Your Name]
[LinkedIn Profile]
[Your Email]`,
  },
  {
    id: 'inquiry-1',
    name: 'Job Opportunity Inquiry',
    subject: 'Inquiry About [Position/Department] Opportunities',
    category: 'inquiry',
    body: `Dear [Hiring Manager/Recruiter Name],

I hope this email finds you well. I am writing to express my strong interest in potential opportunities within [Department/Team] at [Company Name].

With [X years] of experience in [your field], I have developed strong expertise in [key skills]. I am particularly drawn to [Company Name] because of [specific reason - company mission, products, culture, etc.].

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills and experience could contribute to your team's success.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Phone]
[Your Email]
[LinkedIn Profile]`,
  },
  {
    id: 'follow-up-2',
    name: 'Second Follow-up',
    subject: 'Checking In: [Position] Application',
    category: 'follow-up',
    body: `Dear [Hiring Manager Name],

I hope you're doing well. I wanted to reach out one more time regarding my application for the [Position] role at [Company Name].

I remain very interested in this opportunity and would love to learn more about the position and how I can contribute to [Company Name]'s success.

If there's anything else you need from me or if you'd like to schedule a time to chat, please let me know. I'm happy to provide any additional information that would be helpful.

Thank you for your consideration.

Best regards,
[Your Name]`,
  },
  {
    id: 'thank-you-2',
    name: 'Post-Rejection Thank You',
    subject: 'Thank You and Stay Connected',
    category: 'thank-you',
    body: `Dear [Hiring Manager Name],

Thank you for informing me about your decision regarding the [Position] role. While I'm disappointed not to be moving forward at this time, I genuinely appreciate the opportunity to interview and learn more about [Company Name].

I remain very interested in [Company Name] and your mission. I would be grateful if you would keep me in mind for future opportunities that might be a good fit for my skills and experience.

Thank you again for your time and consideration. I wish you and the team continued success.

Best regards,
[Your Name]`,
  },
];

// Helper function to replace placeholders
export function fillTemplate(template: string, data: Record<string, string>): string {
  let filled = template;
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `[${key}]`;
    filled = filled.replace(new RegExp(placeholder, 'g'), value);
  });
  return filled;
}

// Get templates by category
export function getTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(t => t.category === category);
}

// Generate email with template
export function generateEmail(
  templateId: string,
  data: Record<string, string>
): { subject: string; body: string } | null {
  const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    subject: fillTemplate(template.subject, data),
    body: fillTemplate(template.body, data),
  };
}
