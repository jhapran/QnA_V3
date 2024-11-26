import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Users,
  BarChart3,
  Lock,
  Globe,
  Zap,
  Cloud,
  Database,
  Shield
} from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Question Generation',
    description: 'Generate high-quality questions across multiple subjects and formats using advanced AI models.',
    icon: Brain
  },
  {
    name: 'Collaborative Workspace',
    description: 'Share and collaborate on question sets with your team or institution.',
    icon: Users
  },
  {
    name: 'Advanced Analytics',
    description: 'Track usage, analyze patterns, and gain insights into question effectiveness.',
    icon: BarChart3
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-grade encryption and security measures to protect your data.',
    icon: Lock
  },
  {
    name: 'Multi-Language Support',
    description: 'Generate questions in multiple languages to support diverse learning environments.',
    icon: Globe
  },
  {
    name: 'Real-time Generation',
    description: 'Get instant results with our optimized AI processing pipeline.',
    icon: Zap
  },
  {
    name: 'Cloud Integration',
    description: 'Seamlessly integrate with popular cloud storage and LMS platforms.',
    icon: Cloud
  },
  {
    name: 'Data Management',
    description: 'Organize and manage your question bank with advanced filtering and tagging.',
    icon: Database
  },
  {
    name: 'Privacy First',
    description: 'GDPR and FERPA compliant data handling for educational institutions.',
    icon: Shield
  }
];

export function Features() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">Features</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create perfect questions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Powerful features to help educators create, manage, and share educational content efficiently.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div>
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-16">
                      <h3 className="text-xl font-medium text-gray-900">{feature.name}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}