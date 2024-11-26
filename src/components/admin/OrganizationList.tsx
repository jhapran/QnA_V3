import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Building2, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: string;
  users: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Stanford University',
    domain: 'stanford.edu',
    plan: 'enterprise',
    users: 5000,
    status: 'active',
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: '2',
    name: 'MIT',
    domain: 'mit.edu',
    plan: 'enterprise',
    users: 4500,
    status: 'active',
    createdAt: new Date(2024, 1, 1),
  },
  {
    id: '3',
    name: 'Local High School',
    domain: 'lhs.edu',
    plan: 'pro',
    users: 150,
    status: 'active',
    createdAt: new Date(2024, 2, 10),
  },
];

interface OrganizationListProps {
  searchQuery: string;
  filter: string;
}

export function OrganizationList({ searchQuery, filter }: OrganizationListProps) {
  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || org.plan === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Users
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOrganizations.map((org, index) => (
            <motion.tr
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{org.name}</div>
                    <div className="text-sm text-gray-500">{org.domain}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  {org.users.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${org.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                    org.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                    org.plan === 'basic' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {org.plan}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${org.status === 'active' ? 'bg-green-100 text-green-800' :
                    org.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {org.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(org.createdAt, 'MMM d, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}