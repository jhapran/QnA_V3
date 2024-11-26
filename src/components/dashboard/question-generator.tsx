import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { DifficultySelector } from './difficulty-selector';
import { QuestionTypeSelector } from './question-type-selector';
import { TopicSelector } from './topic-selector';
import { DocumentUpload } from './document-upload';
import { SUBJECTS, GRADE_LEVELS } from '@/lib/constants';
import { generateQuestions } from '@/lib/services/questionGenerator';
import { toast } from 'sonner';
import type { Question } from '@/lib/types';

interface QuestionGeneratorProps {
  subject: string;
  onGenerate: (questions: Question[]) => void;
  documentContent?: string | null;
}

export function QuestionGenerator({ subject, onGenerate, documentContent: initialContent }: QuestionGeneratorProps) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('high');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>(initialContent || null);

  const selectedSubject = subject === 'custom' ? null : SUBJECTS.find(s => s.id === subject);

  const handleGenerate = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      const errorMessage = 'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!selectedSubject && !documentContent) {
      toast.error('Please select a topic or upload a document before generating questions.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let topicName = 'custom content';
      let subjectName = 'Custom';

      if (selectedSubject) {
        const selectedTopicData = selectedSubject.topics.find(t => t.id === selectedTopic);
        if (!selectedTopicData && !documentContent) {
          throw new Error('Please select a topic or upload a document');
        }
        if (selectedTopicData) {
          topicName = selectedTopicData.name;
          subjectName = selectedSubject.name;
        }
      }

      const questions = await generateQuestions({
        subject: subjectName,
        topic: topicName,
        difficulty,
        type: questionType,
        count: questionCount,
        context: documentContent
      });
      
      if (questions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      onGenerate(questions);
      toast.success(`Successfully generated ${questions.length} questions!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate questions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentContent = (content: string) => {
    setDocumentContent(content);
    toast.success('Document processed successfully!');
  };

  return (
    <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {!documentContent && (
        <DocumentUpload 
          onContentExtracted={handleDocumentContent}
          disabled={isGenerating}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Grade Level
          </label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isGenerating}
          >
            {GRADE_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} (Grades {level.grades})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.min(10, Math.max(1, Number(e.target.value))))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isGenerating}
          />
        </div>
      </div>

      {selectedSubject && !documentContent && (
        <TopicSelector
          topics={selectedSubject.topics}
          selectedTopic={selectedTopic}
          onSelect={setSelectedTopic}
          gradeLevel={gradeLevel}
          disabled={isGenerating}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <DifficultySelector 
          value={difficulty} 
          onChange={setDifficulty} 
          disabled={isGenerating} 
        />
        <QuestionTypeSelector 
          value={questionType} 
          onChange={setQuestionType} 
          disabled={isGenerating} 
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={(!selectedTopic && !documentContent) || isGenerating}
          className="min-w-[150px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </Button>
      </div>
    </div>
  );
}