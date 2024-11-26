import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SubjectCard } from '../components/dashboard/subject-card';
import { QuestionGenerator } from '../components/dashboard/question-generator';
import { GeneratedQuestions } from '../components/dashboard/generated-questions';
import { DocumentUpload } from '../components/dashboard/document-upload';
import { SUBJECTS } from '../lib/constants';
import type { Question } from '../lib/types';
import { toast } from 'sonner';

export function Dashboard() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [documentContent, setDocumentContent] = useState<string | null>(null);

  const handleGenerate = (questions: Question[]) => {
    setGeneratedQuestions(questions);
  };

  const handleDocumentContent = (content: string) => {
    setDocumentContent(content);
    // If content is successfully processed, automatically move to question generation
    if (content && !selectedSubject) {
      setSelectedSubject('custom');
    }
    toast.success('Document processed successfully!');
  };

  const handleExport = () => {
    const questionsText = generatedQuestions
      .map((q, i) => {
        let text = `${q.id}. ${q.question}\n`;
        if (q.type === 'multiple-choice' && q.options) {
          text += q.options.map((opt, j) => `   ${String.fromCharCode(97 + j)}) ${opt}`).join('\n');
        }
        text += `\nAnswer: ${q.correctAnswer}`;
        if (q.explanation) {
          text += `\nExplanation: ${q.explanation}`;
        }
        return text;
      })
      .join('\n\n');

    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    setSelectedSubject('');
    setGeneratedQuestions([]);
    setDocumentContent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Question Generator</h1>
        <p className="mt-2 text-gray-600">Create customized questions for your students in seconds</p>
      </div>

      {!selectedSubject ? (
        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <DocumentUpload
              onContentExtracted={handleDocumentContent}
              disabled={false}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-sm text-gray-500">or choose a subject</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;
              return (
                <SubjectCard
                  key={subject.id}
                  title={subject.name}
                  description={`Generate questions for ${subject.topics.map(t => t.name).join(', ')}`}
                  icon={<Icon className="h-6 w-6" />}
                  onClick={() => setSelectedSubject(subject.id)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subjects
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedSubject === 'custom' ? 'Custom Content' : SUBJECTS.find(s => s.id === selectedSubject)?.name}
              </h2>
            </div>
          </div>

          <QuestionGenerator
            subject={selectedSubject}
            onGenerate={handleGenerate}
            documentContent={documentContent}
          />

          {generatedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <GeneratedQuestions questions={generatedQuestions} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}