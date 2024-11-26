import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Table, BarChart } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    setIsOpen(false);
    
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
              <div className="py-1">
                {[
                  { format: 'pdf', icon: FileText, label: 'Export as PDF' },
                  { format: 'csv', icon: Table, label: 'Export as CSV' },
                  { format: 'excel', icon: BarChart, label: 'Export as Excel' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.format}
                      onClick={() => handleExport(item.format as 'pdf' | 'csv' | 'excel')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}