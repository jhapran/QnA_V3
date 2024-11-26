import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function QuestionTypeSelector({ value, onChange, disabled }: QuestionTypeSelectorProps) {
  const types = [
    {
      id: 'multiple-choice',
      label: 'Multiple Choice',
      description: 'Questions with predefined answer options'
    },
    {
      id: 'short-answer',
      label: 'Short Answer',
      description: 'Brief responses requiring specific answers'
    },
    {
      id: 'essay',
      label: 'Essay',
      description: 'Long-form answers with detailed explanations'
    }
  ];

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Question Type
      </label>
      <div className="space-y-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            disabled={disabled}
            className={`relative w-full rounded-lg border p-4 text-left transition-colors ${
              value === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {value === type.id && (
              <motion.div
                layoutId="type-indicator"
                className="absolute inset-0 rounded-lg border-2 border-blue-500"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <div
                  className={`h-4 w-4 rounded-full border ${
                    value === type.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {value === type.id && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{type.label}</p>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}