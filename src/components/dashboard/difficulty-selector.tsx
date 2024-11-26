import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface DifficultySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DifficultySelector({ value, onChange, disabled }: DifficultySelectorProps) {
  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'bg-green-500' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { id: 'hard', label: 'Hard', color: 'bg-red-500' }
  ];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Difficulty Level
      </label>
      <div className="grid grid-cols-3 gap-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            onClick={() => onChange(difficulty.id)}
            disabled={disabled}
            className={`relative rounded-md border p-3 text-sm font-medium transition-colors ${
              value === difficulty.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {value === difficulty.id && (
              <motion.div
                layoutId="difficulty-indicator"
                className="absolute inset-0 rounded-md border-2 border-blue-500"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative flex items-center justify-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${difficulty.color}`} />
              <span>{difficulty.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}