import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import type { Assessment } from '@/lib/types/assessment';

interface AssessmentSettingsProps {
  settings: Assessment['settings'];
  onChange: (settings: Assessment['settings']) => void;
  onClose: () => void;
}

export function AssessmentSettings({ settings, onChange, onClose }: AssessmentSettingsProps) {
  const handleChange = (key: keyof Assessment['settings'], value: any) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Assessment Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Question Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Questions</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Shuffle questions</span>
                <input
                  type="checkbox"
                  checked={settings.shuffleQuestions}
                  onChange={e => handleChange('shuffleQuestions', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Shuffle answer options</span>
                <input
                  type="checkbox"
                  checked={settings.shuffleOptions}
                  onChange={e => handleChange('shuffleOptions', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Feedback Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Feedback</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show feedback</span>
                <input
                  type="checkbox"
                  checked={settings.showFeedback}
                  onChange={e => handleChange('showFeedback', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show explanations</span>
                <input
                  type="checkbox"
                  checked={settings.showExplanation}
                  onChange={e => handleChange('showExplanation', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Attempt Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Attempts</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Allow retries</span>
                <input
                  type="checkbox"
                  checked={settings.allowRetries}
                  onChange={e => handleChange('allowRetries', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              {settings.allowRetries && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Maximum retries</span>
                  <input
                    type="number"
                    min="1"
                    value={settings.maxRetries || 1}
                    onChange={e => handleChange('maxRetries', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Display</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show timer</span>
                <input
                  type="checkbox"
                  checked={settings.showTimer}
                  onChange={e => handleChange('showTimer', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Allow pause</span>
                <input
                  type="checkbox"
                  checked={settings.allowPause}
                  onChange={e => handleChange('allowPause', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show progress</span>
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={e => handleChange('showProgress', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}