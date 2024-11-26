import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, CreditCard, Settings2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { OrganizationProfile } from '../../components/organization/OrganizationProfile';
import { TeamMembers } from '../../components/organization/TeamMembers';
import { BillingSettings } from '../../components/organization/BillingSettings';
import { IntegrationSettings } from '../../components/organization/IntegrationSettings';

const tabs = [
  { id: 'profile', name: 'Organization Profile', icon: Building2 },
  { id: 'members', name: 'Team Members', icon: Users },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'integrations', name: 'Integrations', icon: Settings2 },
];

export function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <OrganizationProfile />;
      case 'members':
        return <TeamMembers />;
      case 'billing':
        return <BillingSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization's profile, team members, and settings
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`-ml-1 mr-2 h-5 w-5 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}