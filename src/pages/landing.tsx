import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Target, BookOpen, Settings2, FileCheck, Clock, Users, BarChart3, Zap, Wand2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SelectSubjectIllustration } from '../components/illustrations/select-subject';
import { CustomizeParamsIllustration } from '../components/illustrations/customize-params';
import { GenerateExportIllustration } from '../components/illustrations/generate-export';
import { HeroIllustration } from '../components/illustrations/hero';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-90" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-100/20" />
        </div>
        
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 py-20 lg:py-32">
              {/* Left Content */}
              <motion.div 
                className="lg:col-span-6 flex flex-col justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-x-2 text-blue-600">
                  <Wand2 className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide">AI-POWERED EDUCATION</span>
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl sm:tracking-tight lg:text-5xl xl:text-6xl">
                  <span className="block">Effortless Question</span>
                  <span className="block mt-1">
                    Creation for{' '}
                    <span className="relative whitespace-nowrap">
                      <span className="relative bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Every Topic
                      </span>
                    </span>
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-2xl">
                  Your AI-powered quiz assistant that transforms teaching. Generate customized questions, 
                  quizzes, and educational content in seconds.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={handleGetStarted} className="group">
                    Try for Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-x-8">
                  {[
                    { label: 'Active Teachers', value: '10,000+' },
                    { label: 'Questions Generated', value: '1M+' },
                    { label: 'Time Saved', value: '80%' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex flex-col"
                    >
                      <dt className="text-sm text-gray-600">{stat.label}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Illustration */}
              <motion.div
                className="mt-16 lg:mt-0 lg:col-span-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <HeroIllustration />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Three simple steps to transform your question creation process
            </motion.p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {[
              {
                title: "Select Your Subject",
                description: "Choose from a wide range of subjects and topics tailored to your curriculum",
                illustration: <SelectSubjectIllustration />,
                delay: 0
              },
              {
                title: "Customize Parameters",
                description: "Set difficulty levels, question types, and specific requirements for your content",
                illustration: <CustomizeParamsIllustration />,
                delay: 0.2
              },
              {
                title: "Generate & Export",
                description: "Get AI-generated questions instantly and export in your preferred format",
                illustration: <GenerateExportIllustration />,
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-8 flex h-48 w-48 items-center justify-center">
                    {step.illustration}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-center text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose EduQuery?
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Discover how our platform revolutionizes educational content creation
            </motion.p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Clock className="h-6 w-6 text-blue-600" />,
                title: "Save Valuable Time",
                description: "Generate comprehensive question sets in minutes instead of hours"
              },
              {
                icon: <Target className="h-6 w-6 text-blue-600" />,
                title: "Tailored Content",
                description: "Questions perfectly matched to your curriculum and student level"
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
                title: "Track Progress",
                description: "Monitor student performance and identify areas for improvement"
              },
              {
                icon: <Settings2 className="h-6 w-6 text-blue-600" />,
                title: "Customizable Options",
                description: "Adjust difficulty, format, and content type to meet your needs"
              },
              {
                icon: <FileCheck className="h-6 w-6 text-blue-600" />,
                title: "Quality Assured",
                description: "AI-generated content reviewed for accuracy and relevance"
              },
              {
                icon: <Users className="h-6 w-6 text-blue-600" />,
                title: "Collaborative Features",
                description: "Share and collaborate with other educators in your network"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="relative rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-24 shadow-2xl lg:px-16">
            <div className="relative">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to Transform Your Teaching?
                  </h2>
                  <p className="mt-6 max-w-xl text-lg text-blue-100">
                    Join thousands of educators who are already saving time and creating better content with EduQuery.
                  </p>
                </div>
                <div className="mt-12 lg:mt-0 lg:flex lg:items-center lg:justify-end">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto bg-grey hover:bg-blue-50 text-blue-600 border-transparent font-semibold"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}