/**
 * Interview Questions Bank
 */

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company' | 'closing';
  question: string;
  tips: string[];
  starExample?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export const interviewQuestions: InterviewQuestion[] = [
  // Behavioral Questions
  {
    id: 'b1',
    category: 'behavioral',
    question: 'Tell me about yourself',
    tips: [
      'Keep it professional and relevant to the role',
      'Structure: Present → Past → Future',
      'Highlight key achievements',
      'Keep it under 2 minutes',
    ],
  },
  {
    id: 'b2',
    category: 'behavioral',
    question: 'What are your greatest strengths?',
    tips: [
      'Pick 2-3 strengths relevant to the role',
      'Back up with specific examples',
      'Explain how they benefit the company',
    ],
  },
  {
    id: 'b3',
    category: 'behavioral',
    question: 'What is your greatest weakness?',
    tips: [
      'Be honest but strategic',
      'Show self-awareness',
      'Explain how you\'re working to improve',
      'Don\'t say "I\'m a perfectionist"',
    ],
  },
  {
    id: 'b4',
    category: 'behavioral',
    question: 'Why do you want to work here?',
    tips: [
      'Research the company thoroughly',
      'Mention specific products, culture, or values',
      'Connect to your career goals',
      'Show genuine enthusiasm',
    ],
  },
  {
    id: 'b5',
    category: 'behavioral',
    question: 'Where do you see yourself in 5 years?',
    tips: [
      'Show ambition but be realistic',
      'Align with potential career path at company',
      'Focus on skills and growth',
      'Avoid saying you want their job',
    ],
  },
  {
    id: 'b6',
    category: 'behavioral',
    question: 'Why are you leaving your current job?',
    tips: [
      'Stay positive about previous employer',
      'Focus on what you\'re moving toward',
      'Emphasize growth and new challenges',
      'Never badmouth previous company',
    ],
  },
  {
    id: 'b7',
    category: 'behavioral',
    question: 'Describe a time you failed',
    tips: [
      'Choose a real but not catastrophic failure',
      'Focus on what you learned',
      'Explain how you\'ve grown',
      'Show accountability',
    ],
    starExample: {
      situation: 'Early in my career, I was leading a small project',
      task: 'I needed to deliver a feature in 2 weeks',
      action: 'I underestimated complexity and didn\'t communicate delays',
      result: 'Missed deadline, but learned to break down tasks better and communicate proactively',
    },
  },

  // Situational Questions
  {
    id: 's1',
    category: 'situational',
    question: 'Tell me about a time you worked with a difficult team member',
    tips: [
      'Use STAR method',
      'Show emotional intelligence',
      'Focus on resolution',
      'Avoid blaming others',
    ],
  },
  {
    id: 's2',
    category: 'situational',
    question: 'Describe a time you had to meet a tight deadline',
    tips: [
      'Emphasize prioritization skills',
      'Show time management',
      'Highlight results',
      'Mention any trade-offs made wisely',
    ],
  },
  {
    id: 's3',
    category: 'situational',
    question: 'Tell me about a time you showed leadership',
    tips: [
      'Leadership isn\'t just formal roles',
      'Show initiative and influence',
      'Explain impact on team',
      'Mention what you learned',
    ],
  },
  {
    id: 's4',
    category: 'situational',
    question: 'Describe a conflict you resolved at work',
    tips: [
      'Focus on your problem-solving approach',
      'Show empathy and communication skills',
      'Emphasize positive outcome',
      'Stay professional',
    ],
  },
  {
    id: 's5',
    category: 'situational',
    question: 'Tell me about a time you went above and beyond',
    tips: [
      'Choose a clear extra effort example',
      'Quantify the impact',
      'Show initiative',
      'Connect to business value',
    ],
  },

  // Technical Questions (General)
  {
    id: 't1',
    category: 'technical',
    question: 'Walk me through your most challenging technical project',
    tips: [
      'Choose a project that showcases your skills',
      'Explain the problem clearly',
      'Detail your solution approach',
      'Mention technologies used',
      'Discuss results and learning',
    ],
  },
  {
    id: 't2',
    category: 'technical',
    question: 'How do you stay current with technology?',
    tips: [
      'Mention specific resources (blogs, courses, podcasts)',
      'Talk about side projects or learning',
      'Show genuine interest in growth',
      'Give recent examples',
    ],
  },
  {
    id: 't3',
    category: 'technical',
    question: 'Describe your development process',
    tips: [
      'Talk about planning and design',
      'Mention testing approach',
      'Discuss code review practices',
      'Show understanding of full lifecycle',
    ],
  },
  {
    id: 't4',
    category: 'technical',
    question: 'How do you debug a difficult problem?',
    tips: [
      'Show systematic approach',
      'Mention tools and techniques',
      'Talk about asking for help when needed',
      'Give a specific example',
    ],
  },

  // Company-Specific Questions
  {
    id: 'c1',
    category: 'company',
    question: 'What do you know about our company?',
    tips: [
      'Research products, mission, values',
      'Mention recent news or achievements',
      'Show understanding of industry',
      'Connect to why you want to work there',
    ],
  },
  {
    id: 'c2',
    category: 'company',
    question: 'How would you improve our product?',
    tips: [
      'Actually use the product beforehand',
      'Be respectful and constructive',
      'Back up suggestions with user insights',
      'Show strategic thinking',
    ],
  },
  {
    id: 'c3',
    category: 'company',
    question: 'What can you bring to our team?',
    tips: [
      'Highlight unique skills and experiences',
      'Connect to job requirements',
      'Show cultural fit',
      'Be specific and confident',
    ],
  },

  // Closing Questions (To Ask Interviewer)
  {
    id: 'cl1',
    category: 'closing',
    question: 'What does success look like in this role?',
    tips: [
      'Shows you\'re goal-oriented',
      'Helps understand expectations',
      'Demonstrates seriousness',
    ],
  },
  {
    id: 'cl2',
    category: 'closing',
    question: 'What are the biggest challenges facing the team?',
    tips: [
      'Shows problem-solving mindset',
      'Helps assess if role is right fit',
      'Demonstrates strategic thinking',
    ],
  },
  {
    id: 'cl3',
    category: 'closing',
    question: 'Can you describe the team culture?',
    tips: [
      'Important for culture fit assessment',
      'Shows you value team dynamics',
      'Helps make informed decision',
    ],
  },
  {
    id: 'cl4',
    category: 'closing',
    question: 'What are the next steps in the interview process?',
    tips: [
      'Shows continued interest',
      'Helps you plan follow-up',
      'Professional and expected',
    ],
  },
  {
    id: 'cl5',
    category: 'closing',
    question: 'What opportunities for growth and development exist?',
    tips: [
      'Shows long-term thinking',
      'Demonstrates ambition',
      'Important for career planning',
    ],
  },
];

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category: InterviewQuestion['category']): InterviewQuestion[] {
  return interviewQuestions.filter(q => q.category === category);
}

/**
 * Get random questions for practice
 */
export function getRandomQuestions(count: number = 5): InterviewQuestion[] {
  const shuffled = [...interviewQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * STAR method template
 */
export const STARTemplate = {
  situation: 'Describe the context or challenge you faced',
  task: 'Explain your responsibility or goal',
  action: 'Detail the specific steps you took',
  result: 'Share the outcome and what you learned',
};

/**
 * General interview tips
 */
export const interviewTips = {
  before: [
    'Research the company thoroughly',
    'Practice answers to common questions',
    'Prepare questions to ask the interviewer',
    'Review your resume and be ready to discuss everything',
    'Plan your outfit and route (or test video setup)',
    'Get a good night\'s sleep',
  ],
  during: [
    'Arrive/log in 10-15 minutes early',
    'Bring copies of your resume and a notepad',
    'Listen carefully to each question',
    'Take a moment to think before answering',
    'Use specific examples and quantify achievements',
    'Ask for clarification if needed',
    'Show enthusiasm and positive energy',
    'Make eye contact and be aware of body language',
  ],
  after: [
    'Send a thank-you email within 24 hours',
    'Reflect on what went well and areas to improve',
    'Follow up if you don\'t hear back in the timeframe they mentioned',
    'Be patient but persistent',
  ],
};

/**
 * Red flags to watch for
 */
export const interviewRedFlags = [
  'Vague job description or responsibilities',
  'Interviewer seems unprepared or uninterested',
  'Negative talk about previous employees',
  'Unrealistic expectations or promises',
  'Lack of clear growth opportunities',
  'Poor glassdoor reviews that align with your experience',
  'Pressure to accept immediately',
  'Unprofessional interview conduct',
];

/**
 * Question difficulty assessment
 */
export function getQuestionDifficulty(question: InterviewQuestion): 'easy' | 'medium' | 'hard' {
  if (question.category === 'closing') return 'easy';
  if (question.category === 'behavioral' && !question.starExample) return 'easy';
  if (question.category === 'situational' || question.starExample) return 'medium';
  return 'hard';
}
