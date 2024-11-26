import { Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function SubjectCard({ title, description, icon, onClick }: SubjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="rounded-lg bg-blue-100 p-3">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}