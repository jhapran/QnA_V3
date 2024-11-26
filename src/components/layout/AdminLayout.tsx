import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Header } from './header';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}