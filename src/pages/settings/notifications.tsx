import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function Notifications() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    questionUpdates: true,
    teamMessages: true,
    securityAlerts: true,
    productUpdates: false,
    marketingEmails: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage how and when you want to be notified
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
            </div>
            
            <div className="mt-4 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => toggleSetting('emailNotifications')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Enable email notifications</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.questionUpdates}
                  onChange={() => toggleSetting('questionUpdates')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Question updates and responses</span>
              </label>
            </div>
          </div>

          {/* Team Notifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Team Notifications</h3>
            </div>
            
            <div className="mt-4 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.teamMessages}
                  onChange={() => toggleSetting('teamMessages')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Team messages and mentions</span>
              </label>
            </div>
          </div>

          {/* Security Notifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Security Notifications</h3>
            </div>
            
            <div className="mt-4 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.securityAlerts}
                  onChange={() => toggleSetting('securityAlerts')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Security alerts and updates</span>
              </label>
            </div>
          </div>

          {/* Marketing Notifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Marketing Notifications</h3>
            </div>
            
            <div className="mt-4 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.productUpdates}
                  onChange={() => toggleSetting('productUpdates')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Product updates and announcements</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={() => toggleSetting('marketingEmails')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">Marketing emails and newsletters</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}