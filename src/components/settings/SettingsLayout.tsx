import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Lock, Bell } from 'lucide-react';

interface SettingsLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Profile', href: '/settings/profile', icon: User },
  { name: 'Security', href: '/settings/security', icon: Lock },
  { name: 'Notifications', href: '/settings/notifications', icon: Bell },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="mt-6 flex">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Main content */}
            <div className="ml-8 flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}