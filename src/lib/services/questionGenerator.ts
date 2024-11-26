import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question, QuestionGenerationParams } from '../types';
import { generateOptions } from '../utils/optionsGenerator';
import { retry } from '../utils/retry';
import { parseQuestionResponse } from '../utils/responseParser';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class QuestionGenerationError extends Error {
  constructor(message: string, public readonly questionIndex?: number) {
    super(message);
    this.name = 'QuestionGenerationError';
  }
}

function createPrompt(params: QuestionGenerationParams): string {
  const { subject, topic, difficulty, type, context } = params;
  
  let prompt = `Generate one ${difficulty} level ${type} question`;
  
  if (context) {
    prompt += ` based on the following content:\n\n${context}\n\n`;
  } else {
    prompt += ` about ${topic} in ${subject}.\n\n`;
  }

  prompt += `Format your response EXACTLY as follows:

Question: [Your question here]
${type === 'multiple-choice' ? 'Options: A) [option 1]; B) [option 2]; C) [option 3]; D) [option 4]' : ''}
Answer: ${type === 'multiple-choice' ? '[Letter of correct option] [Correct answer text]' : '[Answer text]'}
Explanation: [Brief explanation]

Requirements:
- Question must be clear and specific
- Use grade-appropriate language
- For multiple choice: exactly 4 options labeled A, B, C, D
- Correct answer must be one of the options for multiple choice
- Include a clear, concise explanation`;

  return prompt;
}

async function generateContent(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  if (!text) {
    throw new Error('Empty response from API');
  }
  
  return text;
}

async function generateSingleQuestion(
  params: QuestionGenerationParams,
  index: number
): Promise<Question> {
  const prompt = createPrompt(params);

  try {
    const response = await retry(
      () => generateContent(prompt),
      3,
      2000
    );

    const parsedQuestion = parseQuestionResponse(response, params.type);
    
    return {
      id: `Q-${index + 1}`,
      ...parsedQuestion,
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty as Question['difficulty'],
      gradeLevel: 'high',
      points: params.difficulty === 'easy' ? 1 : params.difficulty === 'medium' ? 2 : 3,
      timeLimit: params.difficulty === 'easy' ? 2 : params.difficulty === 'medium' ? 5 : 10,
    };
  } catch (error) {
    console.error(`Error generating question ${index + 1}:`, error);
    throw new QuestionGenerationError(
      error instanceof Error ? error.message : 'Failed to generate question',
      index
    );
  }
}

export async function generateQuestions(params: QuestionGenerationParams): Promise<Question[]> {
  const { count } = params;
  const questions: Question[] = [];
  const errors: Error[] = [];

  if (!GEMINI_API_KEY) {
    throw new QuestionGenerationError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Generate questions sequentially with delay to avoid rate limiting
  for (let i = 0; i < count; i++) {
    try {
      // Add delay between questions
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const question = await generateSingleQuestion(params, i);
      questions.push(question);
    } catch (error) {
      errors.push(error as Error);
      console.error(`Failed to generate question ${i + 1}:`, error);
    }
  }

  if (questions.length === 0) {
    throw new QuestionGenerationError(
      'Failed to generate any questions. Please try again.'
    );
  }

  return questions;
}