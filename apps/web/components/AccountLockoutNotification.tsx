import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Shield, AlertTriangle } from 'lucide-react';

interface AccountLockoutNotificationProps {
  lockoutExpiresAt: Date;
  failedAttempts: number;
  onDismiss?: () => void;
}

/**
 * AccountLockoutNotification Component
 *
 * Displays a notification when an account is locked due to failed login attempts.
 * Shows the lockout duration and provides guidance to the user.
 */
const AccountLockoutNotification: React.FC<AccountLockoutNotificationProps> = ({
  lockoutExpiresAt,
  failedAttempts,
  onDismiss,
}) => {
  const now = new Date();
  const timeRemaining = Math.max(0, lockoutExpiresAt.getTime() - now.getTime());
  const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));

  const getLockoutDuration = (attempts: number) => {
    if (attempts >= 10) return '15 minutes';
    if (attempts >= 7) return '10 minutes';
    return '5 minutes';
  };

  const getLockoutReason = (attempts: number) => {
    if (attempts >= 10) return 'excessive failed attempts';
    if (attempts >= 7) return 'multiple failed attempts';
    return 'repeated failed attempts';
  };

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
            Account Temporarily Locked
          </CardTitle>
        </div>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Your account has been locked for security reasons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert
          variant="destructive"
          className="border-orange-200 bg-orange-100 dark:border-orange-800 dark:bg-orange-900"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            Your account is locked due to {getLockoutReason(failedAttempts)} (
            {failedAttempts} attempts).
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-orange-700 dark:text-orange-300">
            <Clock className="h-4 w-4" />
            <span>
              <strong>Lockout Duration:</strong>{' '}
              {getLockoutDuration(failedAttempts)}
            </span>
          </div>

          {timeRemaining > 0 && (
            <div className="text-sm text-orange-700 dark:text-orange-300">
              <strong>Time Remaining:</strong> {minutesRemaining} minute
              {minutesRemaining !== 1 ? 's' : ''}
            </div>
          )}

          <div className="text-sm text-orange-700 dark:text-orange-300">
            <strong>Lockout Expires:</strong>{' '}
            {lockoutExpiresAt.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
          <p>
            <strong>What this means:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You cannot log in during this time</li>
            <li>This is a security measure to protect your account</li>
            <li>
              Your account will be automatically unlocked after the lockout
              period
            </li>
          </ul>
        </div>

        <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
          <p>
            <strong>If you forgot your password:</strong>
          </p>
          <p>
            You can use the "Forgot Password" feature to reset your password.
          </p>
        </div>

        <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
          <p>
            <strong>If you believe this is an error:</strong>
          </p>
          <p>
            Please contact your system administrator or wait for the lockout
            period to expire.
          </p>
        </div>

        {onDismiss && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
            >
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountLockoutNotification;
