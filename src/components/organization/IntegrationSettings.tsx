import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Database, Lock, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: typeof Globe;
  isConnected: boolean;
  isConfigured: boolean;
}

const integrations: Integration[] = [
  {
    id: 'canvas',
    name: 'Canvas LMS',
    description: 'Connect with Canvas to sync courses and assignments',
    icon: Globe,
    isConnected: true,
    isConfigured: true,
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    description: 'Integrate with Blackboard for seamless content sharing',
    icon: Database,
    isConnected: false,
    isConfigured: false,
  },
  {
    id: 'moodle',
    name: 'Moodle',
    description: 'Connect your Moodle instance for question synchronization',
    icon: Lock,
    isConnected: false,
    isConfigured: false,
  },
];

export function IntegrationSettings() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleToggleIntegration = async (integrationId: string, isConnected: boolean) => {
    setConnecting(integrationId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(
        isConnected
          ? 'Integration disconnected successfully'
          : 'Integration connected successfully'
      );
    } catch (error) {
      toast.error('Failed to update integration');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your favorite tools and services
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isConnecting = connecting === integration.id;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-6 bg-white border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{integration.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {integration.isConnected && integration.isConfigured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                )}
                <Button
                  variant={integration.isConnected ? 'outline' : 'default'}
                  onClick={() => handleToggleIntegration(integration.id, integration.isConnected)}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {integration.isConnected ? 'Disconnecting ...' : 'Connecting...'}
                    </>
                  ) : (
                    integration.isConnected ? 'Disconnect' : 'Connect'
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">API Access</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your API keys and webhooks
        </p>

        <div className="mt-4 space-y-4">
          <div className="p-6 bg-white border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">API Key</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Use this key to authenticate API requests
                </p>
              </div>
              <Button variant="outline">Generate New Key</Button>
            </div>
            <div className="mt-4">
              <input
                type="password"
                value="••••••••••••••••"
                readOnly
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Webhook URL</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Receive real-time updates for events
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="mt-4">
              <input
                type="url"
                placeholder="https://your-domain.com/webhook"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}