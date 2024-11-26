import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Clock, Settings, Plus, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { QuestionCard } from './QuestionCard';
import { AssessmentSettings } from './AssessmentSettings';
import type { Assessment, AssessmentQuestion } from '@/lib/types/assessment';
import { toast } from 'sonner';

interface AssessmentBuilderProps {
  initialAssessment?: Assessment;
  onSave: (assessment: Assessment) => Promise<void>;
}

export function AssessmentBuilder({ initialAssessment, onSave }: AssessmentBuilderProps) {
  const [assessment, setAssessment] = useState<Partial<Assessment>>(
    initialAssessment || {
      title: '',
      type: 'quiz',
      questions: [],
      settings: {
        shuffleQuestions: false,
        shuffleOptions: false,
        showFeedback: true,
        showExplanation: true,
        allowRetries: false,
        showTimer: true,
        allowPause: true,
        showProgress: true
      }
    }
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setAssessment(prev => {
      const questions = [...(prev.questions || [])];
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);

      const [movedQuestion] = questions.splice(oldIndex, 1);
      questions.splice(newIndex, 0, movedQuestion);

      // Update order
      questions.forEach((q, index) => {
        q.order = index;
      });

      return { ...prev, questions };
    });
  };

  const handleQuestionAdd = () => {
    // Open question selector modal
  };

  const handleQuestionRemove = (questionId: string) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId)
    }));
  };

  const handleSettingsChange = (settings: Assessment['settings']) => {
    setAssessment(prev => ({
      ...prev,
      settings
    }));
  };

  const handleSave = async () => {
    if (!assessment.title) {
      toast.error('Please enter a title for the assessment');
      return;
    }

    if (!assessment.questions?.length) {
      toast.error('Please add at least one question');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(assessment as Assessment);
      toast.success('Assessment saved successfully');
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <input
            type="text"
            value={assessment.title}
            onChange={e => setAssessment(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Assessment Title"
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          />
          <div className="flex items-center space-x-4 mt-2">
            <select
              value={assessment.type}
              onChange={e => setAssessment(prev => ({ ...prev, type: e.target.value }))}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
              <option value="exam">Exam</option>
              <option value="homework">Homework</option>
              <option value="practice">Practice</option>
            </select>
            {assessment.timeLimit && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {assessment.timeLimit} minutes
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={assessment.questions || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {assessment.questions?.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                onRemove={() => handleQuestionRemove(question.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Question Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleQuestionAdd}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </Button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <AssessmentSettings
            settings={assessment.settings}
            onChange={handleSettingsChange}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}