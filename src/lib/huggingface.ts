import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

const QUESTION_GENERATION_PROMPT = `Generate a {difficulty} {type} question about {topic} in {subject}.
The question should be suitable for {gradeLevel} school students.
Include the correct answer and a brief explanation.

Format the response as JSON:
{
  "question": "...",
  "type": "...",
  "options": ["..."] (for multiple choice only),
  "correctAnswer": "...",
  "explanation": "..."
}`;

export async function generateQuestionWithHuggingFace(params: {
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  gradeLevel: string;
}): Promise<any> {
  const prompt = QUESTION_GENERATION_PROMPT
    .replace('{subject}', params.subject)
    .replace('{topic}', params.topic)
    .replace('{difficulty}', params.difficulty)
    .replace('{type}', params.type)
    .replace('{gradeLevel}', params.gradeLevel);

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    // Parse the generated text as JSON
    const jsonStr = response.generated_text.trim();
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}') + 1;
    const cleanJson = jsonStr.slice(startIdx, endIdx);
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
}