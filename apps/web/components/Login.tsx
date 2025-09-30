import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  LoadingScreen,
  RobotIcon,
  WinningFormBadge,
} from '@/components/loading-screen';
import { OchreBackground } from '@/components/ui/background';
import ThemeToggle from '@/components/ui/theme-toggle';

const Login = () => {
  const { login, isAuthenticated, isLoading, getDefaultRoute } = useAuth();
  const location = useLocation();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || getDefaultRoute();
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(credentials);
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message={[
          'Authenticating User',
          'Verifying Roles',
          'Fetching Approvals',
          'Reading UI',
        ]}
      />
    );
  }

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
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 justify-center flex flex-col"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
              <div className="text-center">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting ||
                    !credentials.username ||
                    !credentials.password
                  }
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                <Link
                  to="/forgot-password"
                  className="text-sm pt-1 opacity-60 hover:text-primary hover:opacity-100 transition-all duration-500 ease-in-out"
                >
                  Forgot your password?
                </Link>
              </div>

              <WinningFormBadge />
            </form>
          </CardContent>
        </Card>
      </div>
    </OchreBackground>
  );
};

export default Login;
