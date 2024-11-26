import { HuggingFaceResponse, QuestionGenerationParams, GeneratedQuestionData } from '../types';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large';

export class HuggingFaceError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'HuggingFaceError';
  }
}

export async function callHuggingFaceAPI(prompt: string): Promise<HuggingFaceResponse> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new HuggingFaceError(
      'Hugging Face API key is not configured. Please add VITE_HUGGINGFACE_API_KEY to your .env file.',
      'API_KEY_MISSING'
    );
  }

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
      const errorData = await response.json().catch(() => ({}));
      throw new HuggingFaceError(
        `API request failed: ${errorData.error || response.statusText}`,
        'API_ERROR'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof HuggingFaceError) {
      throw error;
    }
    throw new HuggingFaceError(
      'Failed to connect to Hugging Face API. Please check your internet connection.',
      'CONNECTION_ERROR'
    );
  }
}