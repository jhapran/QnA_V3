import type { Question } from './types';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large';

async function generateQuestionWithAI(params: {
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
}): Promise<{
  question: string;
  answer: string;
  explanation: string;
  options?: string[];
}> {
  const { subject, topic, difficulty, type } = params;
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('Hugging Face API key is not configured');
  }

  const prompt = `Generate a ${difficulty} ${type} question about ${topic} in ${subject}. Include the correct answer and explanation.`;

  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    const output = result[0].generated_text;

    // Parse the AI response into structured data
    const parts = output.split('\n').filter(Boolean);
    const questionPart = parts[0];
    const answerPart = parts[1]?.replace('Answer:', '').trim() || '';
    const explanationPart = parts[2]?.replace('Explanation:', '').trim() || '';

    // For multiple choice, generate options including the correct answer
    let options: string[] | undefined;
    if (type === 'multiple-choice') {
      options = generateOptions(answerPart);
    }

    return {
      question: questionPart,
      answer: answerPart,
      explanation: explanationPart,
      options,
    };
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question. Please try again.');
  }
}

function generateOptions(correctAnswer: string): string[] {
  // Create plausible but incorrect options
  const baseOptions = [
    correctAnswer,
    generatePlausibleOption(correctAnswer, 1),
    generatePlausibleOption(correctAnswer, 2),
    generatePlausibleOption(correctAnswer, 3),
  ];
  
  // Shuffle the options
  return baseOptions.sort(() => Math.random() - 0.5);
}

function generatePlausibleOption(correctAnswer: string, seed: number): string {
  // If the correct answer is a number, generate nearby values
  const numAnswer = parseFloat(correctAnswer);
  if (!isNaN(numAnswer)) {
    const variance = Math.max(1, Math.abs(numAnswer * 0.2));
    return String(numAnswer + (variance * seed * (Math.random() > 0.5 ? 1 : -1)));
  }
  
  // For text answers, modify the correct answer slightly
  const words = correctAnswer.split(' ');
  if (words.length > 1) {
    const modifiedWords = [...words];
    const randomIndex = Math.floor(Math.random() * words.length);
    modifiedWords[randomIndex] = generateSimilarWord(words[randomIndex], seed);
    return modifiedWords.join(' ');
  }
  
  return generateSimilarWord(correctAnswer, seed);
}

function generateSimilarWord(word: string, seed: number): string {
  const alternatives = {
    increase: ['rise', 'grow', 'expand'],
    decrease: ['fall', 'shrink', 'reduce'],
    positive: ['plus', 'above', 'higher'],
    negative: ['minus', 'below', 'lower'],
  };
  
  const key = word.toLowerCase() as keyof typeof alternatives;
  if (key in alternatives) {
    return alternatives[key][seed % alternatives[key].length];
  }
  
  return word + (seed % 2 === 0 ? 's' : 'ed');
}

export async function generateQuestions(params: {
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  count: number;
}): Promise<Question[]> {
  const { count } = params;
  const questions: Question[] = [];
  const errors: Error[] = [];

  // Generate questions in parallel
  const promises = Array.from({ length: count }, async (_, index) => {
    try {
      const result = await generateQuestionWithAI({
        subject: params.subject,
        topic: params.topic,
        difficulty: params.difficulty,
        type: params.questionType,
      });

      return {
        id: `q${index + 1}`,
        question: result.question,
        type: params.questionType as Question['type'],
        subject: params.subject,
        topic: params.topic,
        difficulty: params.difficulty as Question['difficulty'],
        gradeLevel: 'high',
        options: result.options,
        correctAnswer: result.answer,
        explanation: result.explanation,
        points: params.difficulty === 'easy' ? 1 : params.difficulty === 'medium' ? 2 : 3,
        timeLimit: params.difficulty === 'easy' ? 2 : params.difficulty === 'medium' ? 5 : 10,
      };
    } catch (error) {
      errors.push(error as Error);
      console.error(`Error generating question ${index + 1}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validQuestions = results.filter((q): q is Question => q !== null);

  if (validQuestions.length === 0) {
    throw new Error('Failed to generate any questions. Please check your API key and try again.');
  }

  if (errors.length > 0) {
    console.warn(`Generated ${validQuestions.length}/${count} questions. Some questions failed to generate.`);
  }

  return validQuestions;
}