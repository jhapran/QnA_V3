import { useEffect } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { databaseService } from '@/lib/services/databaseService';
import { DataTable } from '../data/DataTable';
import type { Database } from '@/lib/types/database';

type User = Database['public']['Tables']['users']['Row'] & {
  roles: { name: string };
};

const columns = [
  {
    header: 'Name',
    accessorKey: 'full_name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'roles.name',
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString(),
  },
];

export function UsersList() {
  const { data: users, isLoading, error, fetchData } = useDatabase<User>();

  useEffect(() => {
    fetchData(() => databaseService.getUsers());
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 rounded-lg bg-red-50">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <DataTable data={users} columns={columns} />
    </div>
  );
}