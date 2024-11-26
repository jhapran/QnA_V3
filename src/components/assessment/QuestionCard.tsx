import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AssessmentQuestion } from '@/lib/types/assessment';

interface QuestionCardProps {
  question: AssessmentQuestion;
  index: number;
  onRemove: () => void;
}

export function QuestionCard({ question, index, onRemove }: QuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-white rounded-lg border p-4 ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Drag Handle */}
        <button
          className="mt-1 cursor-move touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>

        {/* Question Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Question {index}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {question.points} points
              </span>
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-gray-900">
            {question.content}
          </div>
          {question.type === 'multiple-choice' && question.options && (
            <div className="mt-3 space-y-2">
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    option === question.correctAnswer
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      option === question.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}
                  />
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}