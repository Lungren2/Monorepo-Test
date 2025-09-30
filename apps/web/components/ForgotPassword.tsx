import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import ThemeToggle from '@/components/ui/theme-toggle';
import { OchreBackground } from '@/components/ui/background';
import { RobotIcon } from '@/components/loading-screen';

/**
 * ForgotPassword Component
 *
 * Allows users to request a password reset by entering their email address.
 * Provides feedback on the request status and guides users through the process.
 */
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);

      if (err.response?.status === 429) {
        setError(
          'Too many requests. Please wait a few minutes before trying again.'
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
                Check Your Email
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  If an account with the email address <strong>{email}</strong>{' '}
                  exists in our system, you will receive a password reset link
                  within a few minutes.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>What to do next:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the reset link in the email</li>
                  <li>Create a new password</li>
                  <li>Log in with your new password</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setError(null);
                  }}
                >
                  Try Different Email
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <OchreBackground>
        <div className="min-h-screen flex items-center justify-center px-4">
          {/* Theme Toggle in top right */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <Card className="w-full bg-card/50 backdrop-filter backdrop-blur-md hover:scale-102 transition-all duration-300 ease-in-out max-w-md sm:min-w-sm">
            <CardHeader className="space-y-4">
              {/* WinningForm Logo */}
              <div className="relative flex flex-col items-center justify-center">
                <h3 className="-mb-[3.25rem] text-3xl">ROBOT</h3>
                <RobotIcon
                  className={`transition-all duration-300 ease-in-out opacity-100 scale-100 relative -mb-10 h-auto w-42`}
                  title="ROBOT"
                  colors={{
                    frame: 'hsl(var(--foreground))',
                    frameStroke: 'hsl(var(--foreground))',
                    accent1: 'hsl(var(--destructive))',
                    accent2: 'hsl(var(--success))',
                    accent3: 'hsl(var(--warning))',
                  }}
                />
              </div>

              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your
                password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !email.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className="inline-flex pt-1 items-center text-sm opacity-60 hover:text-primary hover:opacity-100 transition-all duration-500 ease-in-out"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </OchreBackground>
    </>
  );
};

export default ForgotPassword;
