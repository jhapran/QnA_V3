import { Topic } from '@/lib/types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopic: string;
  onSelect: (topicId: string) => void;
  gradeLevel: string;
  disabled?: boolean;
}

export function TopicSelector({ topics, selectedTopic, onSelect, gradeLevel, disabled }: TopicSelectorProps) {
  const filteredTopics = topics.filter(topic => topic.gradeLevel.includes(gradeLevel));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Topic</h3>
      <div className="grid gap-3">
        {filteredTopics.map((topic) => (
          <motion.button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            disabled={disabled}
            className={`relative flex items-center space-x-3 rounded-lg border p-4 text-left ${
              selectedTopic === topic.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                selectedTopic === topic.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}
            >
              {selectedTopic === topic.id && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{topic.name}</p>
              <p className="text-sm text-gray-500">{topic.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}