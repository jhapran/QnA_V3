import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface Transaction {
  id: string;
  date: Date;
  organization: string;
  amount: number;
  status: 'successful' | 'failed' | 'pending';
  invoiceUrl: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'INV-001',
    date: new Date(2024, 2, 15),
    organization: 'Stanford University',
    amount: 4999,
    status: 'successful',
    invoiceUrl: '#',
  },
  {
    id: 'INV-002',
    date: new Date(2024, 2, 14),
    organization: 'MIT',
    amount: 4999,
    status: 'successful',
    invoiceUrl: '#',
  },
  {
    id: 'INV-003',
    date: new Date(2024, 2, 13),
    organization: 'Harvard University',
    amount: 999,
    status: 'failed',
    invoiceUrl: '#',
  },
];

export function BillingHistory() {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Download</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{transaction.organization}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${transaction.status === 'successful' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {transaction.status === 'successful' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(transaction.date, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}