import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, Shield, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function Security() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleTwoFactor = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
      toast.success(
        isTwoFactorEnabled
          ? 'Two-factor authentication disabled'
          : 'Two-factor authentication enabled'
      );
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account security and authentication settings
          </p>
        </div>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Change Password
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="current-password"
                  required
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="new-password"
                  required
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirm-password"
                  required
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>

        {/* Two-Factor Authentication */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                type="button"
                variant={isTwoFactorEnabled ? 'outline' : 'default'}
                onClick={toggleTwoFactor}
              >
                {isTwoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          {isTwoFactorEnabled && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Smartphone className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Authenticator app enabled
                  </p>
                  <p className="text-sm text-gray-500">
                    Using Google Authenticator
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage and log out of your active sessions on other devices.
          </p>
          <div className="mt-4">
            <Button variant="outline" className="text-red-600">
              Log out of all sessions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}