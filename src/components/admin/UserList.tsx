import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Mail, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'educator' | 'student';
  organization: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@stanford.edu',
    role: 'educator',
    organization: 'Stanford University',
    status: 'active',
    lastActive: new Date(2024, 2, 15),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@mit.edu',
    role: 'admin',
    organization: 'MIT',
    status: 'active',
    lastActive: new Date(2024, 2, 14),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.j@harvard.edu',
    role: 'student',
    organization: 'Harvard University',
    status: 'pending',
    lastActive: new Date(2024, 2, 13),
  },
];

interface UserListProps {
  searchQuery: string;
  roleFilter: string;
  orgFilter: string;
}

export function UserList({ searchQuery, roleFilter, orgFilter }: UserListProps) {
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesOrg = orgFilter === 'all' || user.organization.toLowerCase().includes(orgFilter);
    return matchesSearch && matchesRole && matchesOrg;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Active
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'educator' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-900">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  {user.organization}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(user.lastActive, 'MMM d, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}