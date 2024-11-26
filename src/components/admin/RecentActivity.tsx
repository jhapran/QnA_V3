import { motion } from 'framer-motion';
import { format } from 'date-fns';

const activities = [
  {
    id: 1,
    type: 'new_organization',
    content: 'New organization "Stanford University" joined',
    timestamp: new Date(2024, 2, 15, 14, 30),
  },
  {
    id: 2,
    type: 'subscription_upgrade',
    content: 'MIT upgraded to Enterprise plan',
    timestamp: new Date(2024, 2, 15, 12, 45),
  },
  {
    id: 3,
    type: 'user_milestone',
    content: 'Reached 1,000 active users milestone',
    timestamp: new Date(2024, 2, 15, 10, 15),
  },
  {
    id: 4,
    type: 'support_ticket',
    content: 'New support ticket from Harvard University',
    timestamp: new Date(2024, 2, 15, 9, 20),
  },
  {
    id: 5,
    type: 'feature_release',
    content: 'New feature: Advanced Analytics released',
    timestamp: new Date(2024, 2, 15, 8, 0),
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{activity.content}</p>
            <p className="text-xs text-gray-500">
              {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}