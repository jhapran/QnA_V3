import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { useAuth } from '@/lib/store/auth';
import { toast } from 'sonner';
import { z } from 'zod';

// Form validation schema
const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters')
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, error: authError, user, initialized } = useAuth();
  const [form, setForm] = useState<SignInForm>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<SignInForm>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the return URL from location state or default to dashboard
  const returnUrl = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user && initialized) {
      navigate(returnUrl, { replace: true });
    }
  }, [user, initialized, navigate, returnUrl]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const validateField = (field: keyof SignInForm, value: string) => {
    try {
      signInSchema.shape[field].parse(value);
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message;
        setFormErrors(prev => ({ ...prev, [field]: message }));
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof SignInForm, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      const result = signInSchema.safeParse(form);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        setFormErrors(errors as Partial<SignInForm>);
        return;
      }

      await signIn(form.email, form.password);
      toast.success('Successfully signed in!');
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : error.message;
        toast.error(errorMessage);
        setFormErrors(prev => ({
          ...prev,
          password: errorMessage === 'Invalid email or password' ? errorMessage : undefined
        }));
      } else {
        toast.error('Failed to sign in');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-6">
            <div>
              <motion.h1 
                className="text-2xl font-bold tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Welcome back
              </motion.h1>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  state={{ from: location.state?.from }}
                >
                  Sign up
                </Link>
              </p>
            </div>

            <OAuthButtons 
              action="sign-in" 
              isDisabled={isLoading || isSubmitting} 
              returnUrl={returnUrl}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
                      formErrors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
                      formErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="flex w-full justify-center"
                >
                  {(isLoading || isSubmitting) ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <motion.img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth-background.jpg"
          alt="Authentication background"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        />
      </div>
    </div>
  );
}