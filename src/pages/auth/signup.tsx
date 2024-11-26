import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { useAuth } from '@/lib/store/auth';
import { toast } from 'sonner';

interface FormErrors {
  fullName: string;
  email: string;
  password: string;
  terms: string;
}

export function SignUp() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<FormErrors>({
    fullName: '',
    email: '',
    password: '',
    terms: ''
  });

  const validateField = useCallback((field: keyof FormErrors, value: string | boolean): string => {
    switch (field) {
      case 'fullName':
        if (!value || typeof value !== 'string') return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value || typeof value !== 'string') return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value || typeof value !== 'string') return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return '';
      case 'terms':
        if (!value) return 'You must accept the Terms of Service and Privacy Policy';
        return '';
      default:
        return '';
    }
  }, []);

  const handleBlur = useCallback((field: keyof FormErrors) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const value = field === 'terms' ? acceptedTerms : 
                 field === 'fullName' ? fullName :
                 field === 'email' ? email : password;
    
    setFormErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  }, [validateField, fullName, email, password, acceptedTerms]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      fullName: validateField('fullName', fullName),
      email: validateField('email', email),
      password: validateField('password', password),
      terms: validateField('terms', acceptedTerms)
    };

    setFormErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  }, [validateField, fullName, email, password, acceptedTerms]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setTouchedFields(new Set(['fullName', 'email', 'password', 'terms']));
      return;
    }

    try {
      await signUp(email, password, fullName);
      toast.success('Account created successfully! Please sign in.');
      navigate('/signin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
      console.error('Sign up error:', error);
    }
  };

  const shouldShowError = (field: keyof FormErrors): string | undefined => {
    return touchedFields.has(field) ? formErrors[field] : undefined;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
              Sign in
            </Link>
          </p>
        </div>

        <OAuthButtons action="sign-up" isDisabled={isLoading} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={shouldShowError('fullName') !== undefined}
                  aria-describedby={shouldShowError('fullName') ? 'fullname-error' : undefined}
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              {shouldShowError('fullName') && (
                <p id="fullname-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {shouldShowError('fullName')}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={shouldShowError('email') !== undefined}
                  aria-describedby={shouldShowError('email') ? 'email-error' : undefined}
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              {shouldShowError('email') && (
                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {shouldShowError('email')}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={shouldShowError('password') !== undefined}
                  aria-describedby="password-requirements password-error"
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {shouldShowError('password') && (
                <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {shouldShowError('password')}
                </p>
              )}
              <p id="password-requirements" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 8 characters and contain uppercase, lowercase, and numbers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  onBlur={() => handleBlur('terms')}
                  aria-invalid={shouldShowError('terms') !== undefined}
                  aria-describedby={shouldShowError('terms') ? 'terms-error' : undefined}
                  className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                />
              </div>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {shouldShowError('terms') && (
              <p id="terms-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                {shouldShowError('terms')}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 transition-colors"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <motion.div
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                role="status"
                aria-label="Creating account..."
              />
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}