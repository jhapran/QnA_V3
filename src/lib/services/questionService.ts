import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import type { 
  Question, 
  QuestionType, 
  BloomsLevel,
  RubricCriteria 
} from '../types/question';
import { supabase } from '../config/supabase';
import { retry } from '../utils/retry';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export class QuestionService {
  private static instance: QuestionService;
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  private constructor() {}

  static getInstance(): QuestionService {
    if (!this.instance) {
      this.instance = new QuestionService();
    }
    return this.instance;
  }

  async generateQuestion(params: {
    subject: string;
    topic: string;
    type: QuestionType;
    difficulty: string;
    bloomsLevel: BloomsLevel;
    gradeLevel: string;
    curriculum?: string;
    language?: string;
  }): Promise<Question> {
    const prompt = this.createPrompt(params);

    try {
      const result = await retry(
        async () => {
          const response = await this.model.generateContent(prompt);
          return response.response.text();
        },
        3,
        1000
      );

      return this.parseResponse(result, params);
    } catch (error) {
      console.error('Error generating question:', error);
      throw new Error('Failed to generate question');
    }
  }

  async generateRubric(question: Question): Promise<RubricCriteria[]> {
    const prompt = `Create a detailed rubric for grading the following ${question.type} question:
      "${question.content}"
      
      Include specific criteria for:
      - Content accuracy
      - Reasoning/explanation
      - Use of subject-specific terminology
      - Organization/clarity
      
      Format as JSON with criteria, descriptions, points, and scoring levels.`;

    try {
      const result = await this.model.generateContent(prompt);
      const rubric = JSON.parse(result.response.text());
      return rubric;
    } catch (error) {
      console.error('Error generating rubric:', error);
      throw new Error('Failed to generate rubric');
    }
  }

  async validateQuestion(question: Question): Promise<{
    isValid: boolean;
    issues?: string[];
    suggestions?: string[];
  }> {
    const prompt = `Validate the following question for accuracy and quality:
      
      Question: ${question.content}
      Type: ${question.type}
      Subject: ${question.subject}
      Topic: ${question.topic}
      Grade Level: ${question.gradeLevel}
      Correct Answer: ${question.correctAnswer}
      
      Check for:
      1. Content accuracy
      2. Age-appropriate language
      3. Clear instructions
      4. Unambiguous answer
      5. Alignment with curriculum standards
      
      Return JSON with validation results.`;

    try {
      const result = await this.model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Error validating question:', error);
      throw new Error('Failed to validate question');
    }
  }

  async translateQuestion(question: Question, targetLanguage: string): Promise<Question> {
    const prompt = `Translate this question to ${targetLanguage}:
      
      Question: ${question.content}
      Options: ${question.options?.join(', ')}
      Answer: ${question.correctAnswer}
      Explanation: ${question.explanation}
      
      Maintain academic terminology and context.
      Return JSON with translated content.`;

    try {
      const result = await this.model.generateContent(prompt);
      const translated = JSON.parse(result.response.text());
      return {
        ...question,
        ...translated,
        language: targetLanguage
      };
    } catch (error) {
      console.error('Error translating question:', error);
      throw new Error('Failed to translate question');
    }
  }

  async saveQuestion(question: Question): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving question:', error);
      throw new Error('Failed to save question');
    }
  }

  private createPrompt(params: any): string {
    return `Generate a ${params.difficulty} level ${params.type} question about ${params.topic} in ${params.subject}.
      Target grade level: ${params.gradeLevel}
      Bloom's Taxonomy level: ${params.bloomsLevel}
      ${params.curriculum ? `Align with curriculum: ${params.curriculum}` : ''}
      ${params.language ? `Generate in language: ${params.language}` : ''}
      
      Requirements:
      - Clear and concise language
      - Age-appropriate vocabulary
      - Subject-specific terminology
      - Unambiguous correct answer
      - Detailed explanation
      - Include 2-3 hints for scaffolding
      
      Format response as JSON with:
      - question
      - type
      - options (for multiple choice)
      - correctAnswer
      - explanation
      - hints
      - metadata`;
  }

  private parseResponse(response: string, params: any): Question {
    const parsed = JSON.parse(response);
    
    return {
      id: crypto.randomUUID(),
      content: parsed.question,
      type: params.type,
      difficulty: params.difficulty,
      subject: params.subject,
      topic: params.topic,
      gradeLevel: params.gradeLevel,
      bloomsLevel: params.bloomsLevel,
      options: parsed.options,
      correctAnswer: parsed.correctAnswer,
      explanation: parsed.explanation,
      hints: parsed.hints,
      points: this.calculatePoints(params.difficulty, params.bloomsLevel),
      metadata: {
        version: 1,
        isVerified: false
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private calculatePoints(difficulty: string, bloomsLevel: BloomsLevel): number {
    const difficultyMultiplier = {
      easy: 1,
      medium: 2,
      hard: 3
    };

    const bloomsMultiplier = {
      remember: 1,
      understand: 1.2,
      apply: 1.5,
      analyze: 1.8,
      evaluate: 2,
      create: 2.5
    };

    return Math.round(
      difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] *
      bloomsMultiplier[bloomsLevel] *
      10
    );
  }
}

export const questionService = QuestionService.getInstance();