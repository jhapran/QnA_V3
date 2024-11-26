interface ParsedQuestion {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export function parseQuestionResponse(response: string, type: string): ParsedQuestion {
  const lines = response.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Find required components
  const questionLine = lines.find(line => /^question:/i.test(line));
  const answerLine = lines.find(line => /^answer:/i.test(line));
  const optionsLine = type === 'multiple-choice' ? 
    lines.find(line => /^options:/i.test(line)) : undefined;
  const explanationLine = lines.find(line => /^explanation:/i.test(line));

  if (!questionLine || !answerLine) {
    throw new Error('Invalid response format: Missing question or answer');
  }

  const question = questionLine.replace(/^question:\s*/i, '').trim();
  let correctAnswer = answerLine.replace(/^answer:\s*/i, '').trim();
  const explanation = explanationLine?.replace(/^explanation:\s*/i, '').trim();

  if (!question || !correctAnswer) {
    throw new Error('Question or answer is empty');
  }

  let options: string[] | undefined;
  if (type === 'multiple-choice') {
    if (optionsLine) {
      // Extract letter and option text, e.g., "A) Option 1" -> "Option 1"
      options = optionsLine
        .replace(/^options:\s*/i, '')
        .split(/[;,]/)
        .map(opt => opt.trim().replace(/^[A-D]\)\s*/, ''))
        .filter(Boolean);

      // If answer starts with a letter (A-D), extract the actual answer text
      const answerMatch = correctAnswer.match(/^([A-D])\)?\s*(.+)$/i);
      if (answerMatch) {
        const [, letter, answerText] = answerMatch;
        correctAnswer = answerText.trim();
        
        // Ensure the correct answer is in the options
        if (options.length === 4 && !options.includes(correctAnswer)) {
          options[letter.charCodeAt(0) - 65] = correctAnswer;
        }
      }
    }

    // If options are invalid, generate new ones
    if (!options || options.length !== 4) {
      options = generateOptions(correctAnswer);
    }
  }

  return {
    question,
    type,
    options,
    correctAnswer,
    explanation,
  };
}