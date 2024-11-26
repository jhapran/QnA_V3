export function generateOptions(correctAnswer: string): string[] {
  const options = new Set<string>([correctAnswer]);
  
  while (options.size < 4) {
    const option = generatePlausibleOption(correctAnswer, options.size);
    if (option !== correctAnswer) {
      options.add(option);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function generatePlausibleOption(correctAnswer: string, seed: number): string {
  const numAnswer = parseFloat(correctAnswer);
  
  if (!isNaN(numAnswer)) {
    return generateNumericOption(numAnswer, seed);
  }
  
  return generateTextOption(correctAnswer, seed);
}

function generateNumericOption(value: number, seed: number): string {
  const variance = Math.max(1, Math.abs(value * 0.2));
  const adjustment = variance * (seed + Math.random()) * (Math.random() > 0.5 ? 1 : -1);
  return (value + adjustment).toFixed(2);
}

function generateTextOption(text: string, seed: number): string {
  const words = text.split(' ');
  if (words.length > 1) {
    const modifiedWords = [...words];
    const randomIndex = Math.floor(Math.random() * words.length);
    modifiedWords[randomIndex] = getAlternativeWord(words[randomIndex], seed);
    return modifiedWords.join(' ');
  }
  return getAlternativeWord(text, seed);
}

function getAlternativeWord(word: string, seed: number): string {
  const alternatives: Record<string, string[]> = {
    increase: ['rise', 'grow', 'expand'],
    decrease: ['fall', 'shrink', 'reduce'],
    positive: ['plus', 'above', 'higher'],
    negative: ['minus', 'below', 'lower'],
  };
  
  const key = word.toLowerCase();
  if (key in alternatives) {
    return alternatives[key][seed % alternatives[key].length];
  }
  
  return word + (seed % 2 === 0 ? 's' : 'ed');
}