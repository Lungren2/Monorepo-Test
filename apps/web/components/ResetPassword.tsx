import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
import { Loader2, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { OchreBackground } from '@/components/ui/background';
import ThemeToggle from '@/components/ui/theme-toggle';
import { LoadingScreen, RobotIcon } from '@/components/loading-screen';
import PasswordStrength from '@/components/ui/password-strength';

/**
 * ResetPassword Component
 *
 * Allows users to reset their password using a token from the email link.
 * Validates the token and provides a form to enter a new password.
 */
const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError('No reset token provided');
        setIsValidating(false);
        return;
      }

      try {
        const response = await api.get(
          `/auth/verify-reset-token?token=${encodeURIComponent(token)}`
        );

        if (response.data?.isValid) {
          setIsValidToken(true);
        } else {
          setTokenError(
            response.data?.message || 'Invalid or expired reset token'
          );
        }
      } catch (err: any) {
        console.error('Token validation error:', err);
        setTokenError(
          'Failed to validate reset token. Please request a new one.'
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      if (response.data?.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);

      if (err.response?.status === 422) {
        setError('Invalid or expired reset token. Please request a new one.');
      } else if (err.response?.status === 429) {
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

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (isValidating) {
    return <LoadingScreen message={['Validating Reset Token']} />;
  }

  if (tokenError) {
    return (
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
                The reset link you clicked is invalid or has expired. Please
                request a new password reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <Link to="/forgot-password">
                    <Button className="w-full">Request New Reset Link</Button>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex pt-1 items-center text-sm opacity-60 hover:text-primary hover:opacity-100 transition-all duration-500 ease-in-out"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </OchreBackground>
    );
  }

  if (isSuccess) {
    return (
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
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  You can now log in with your new password.
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </OchreBackground>
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
                Enter your new password below
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
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      disabled={isLoading}
                      className="w-full pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      disabled={isLoading}
                      className="w-full pr-10"
                    />
                  </div>
                </div>

                <PasswordStrength password={newPassword} />

                <div className="text-center">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isLoading ||
                      !newPassword ||
                      !confirmPassword ||
                      passwordStrength <= 4
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
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

export default ResetPassword;
