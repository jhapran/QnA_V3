import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Download, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { SUBSCRIPTION_PLANS } from '../../lib/constants/plans';
import { format } from 'date-fns';

export function BillingSettings() {
  const [currentPlan] = useState('pro');

  const nextBillingDate = new Date(2024, 3, 15);
  const lastInvoiceDate = new Date(2024, 2, 15);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
        <div className="mt-4 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                {SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS].name} Plan
              </p>
              <p className="mt-1 text-sm text-blue-700">
                ${SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS].price}/month
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS].features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-blue-900">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
        <div className="mt-4 flex items-center justify-between p-4 bg-white border rounded-lg">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2024</p>
            </div>
          </div>
          <Button variant="outline">Update</Button>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Next billing date</p>
                <p className="text-sm text-gray-500">{format(nextBillingDate, 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
        <div className="mt-4">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(lastInvoiceDate, 'MMMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $99.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}