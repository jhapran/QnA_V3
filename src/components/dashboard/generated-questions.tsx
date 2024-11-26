import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface GeneratedQuestionsProps {
  questions: Question[];
}

export function GeneratedQuestions({ questions }: GeneratedQuestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-white overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <div className="pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">{question.id}.</span>
                <p className="text-sm font-medium text-gray-900">{question.question}</p>
              </div>
            </div>
            {expandedId === question.id ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedId === question.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-gray-200"
              >
                <div className="p-4 bg-gray-50">
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="mb-4 space-y-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 rounded-md p-2 ${
                            option === question.correctAnswer
                              ? 'bg-green-50 text-green-700'
                              : 'bg-white'
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

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Answer:</p>
                    <p className="text-sm text-gray-700">{question.correctAnswer}</p>
                    {question.explanation && (
                      <>
                        <p className="text-sm font-medium text-gray-900">Explanation:</p>
                        <p className="text-sm text-gray-700">{question.explanation}</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}