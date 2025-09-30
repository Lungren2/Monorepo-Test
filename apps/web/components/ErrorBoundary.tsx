import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Wifi, Database } from 'lucide-react';
import { detectCorsError, detectNetworkError } from '@/lib/cors-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType?: 'CORS' | 'NETWORK' | 'SELECT_VALUE' | 'GENERIC';
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Categorize the error type
    const errorType = this.categorizeError(error);

    this.setState({
      error,
      errorInfo,
      errorType,
    });

    // Log error to monitoring service with categorization
    this.logErrorToService(error, errorInfo, errorType);
  }

  private categorizeError(
    error: Error
  ): 'CORS' | 'NETWORK' | 'SELECT_VALUE' | 'GENERIC' {
    const errorMessage = error.message.toLowerCase();

    // Check for CORS errors
    if (detectCorsError(error)) {
      return 'CORS';
    }

    // Check for network errors
    if (detectNetworkError(error)) {
      return 'NETWORK';
    }

    // Check for Select component value errors
    if (
      errorMessage.includes('select.item') ||
      errorMessage.includes('value prop') ||
      errorMessage.includes('non-empty string')
    ) {
      return 'SELECT_VALUE';
    }

    return 'GENERIC';
  }

  private logErrorToService = (
    error: Error,
    errorInfo: ErrorInfo,
    errorType?: string
  ) => {
    // In a real application, you would send this to your error monitoring service
    // like Sentry, LogRocket, or Bugsnag
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
      // Additional context for specific error types
      ...(errorType === 'CORS' && {
        corsDetails: {
          origin: window.location.origin,
          referrer: document.referrer,
          isOnline: navigator.onLine,
        },
      }),
      ...(errorType === 'NETWORK' && {
        networkDetails: {
          isOnline: navigator.onLine,
          connection:
            (
              navigator as unknown as {
                connection?: { effectiveType?: string };
              }
            ).connection?.effectiveType || 'unknown',
        },
      }),
    };

    console.error('Error logged to monitoring service:', errorData);

    // In production, send to error tracking service
    if (import.meta.env.MODE === 'production') {
      // Example: Sentry.captureException(error, { extra: errorData });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorType: undefined,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private getErrorIcon = () => {
    switch (this.state.errorType) {
      case 'CORS':
      case 'NETWORK':
        return <Wifi className="w-16 h-16 text-destructive" />;
      case 'SELECT_VALUE':
        return <Database className="w-16 h-16 text-destructive" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-destructive" />;
    }
  };

  private getErrorTitle = () => {
    switch (this.state.errorType) {
      case 'CORS':
        return 'Connection Issue';
      case 'NETWORK':
        return 'Network Error';
      case 'SELECT_VALUE':
        return 'Data Validation Error';
      default:
        return 'Something went wrong';
    }
  };

  private getErrorDescription = () => {
    switch (this.state.errorType) {
      case 'CORS':
        return 'Unable to connect to the server due to security restrictions. This is likely a temporary issue.';
      case 'NETWORK':
        return 'Network connection failed. Please check your internet connection and try again.';
      case 'SELECT_VALUE':
        return 'There was an issue with form data validation. Some dropdown values may be missing.';
      default:
        return "We're sorry, but an unexpected error occurred. Our team has been notified.";
    }
  };

  private getErrorSuggestions = () => {
    switch (this.state.errorType) {
      case 'CORS':
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the issue persists',
        ];
      case 'NETWORK':
        return [
          'Check your internet connection',
          'Try again in a few moments',
          'Switch to a different network if available',
        ];
      case 'SELECT_VALUE':
        return [
          'Try refreshing the page to reload data',
          'Clear your browser cache',
          'Contact support if forms are not working',
        ];
      default:
        return [
          'Try refreshing the page',
          'Clear your browser cache',
          'Contact support if the issue continues',
        ];
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const suggestions = this.getErrorSuggestions();

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {this.getErrorIcon()}
              </div>
              <CardTitle className="text-2xl">{this.getErrorTitle()}</CardTitle>
              <CardDescription className="text-lg">
                {this.getErrorDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error-specific suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Try these solutions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again{' '}
                  {this.state.retryCount > 0 && `(${this.state.retryCount})`}
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              {/* Show retry count if user has tried multiple times */}
              {this.state.retryCount > 2 && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Still having issues? Consider contacting support.</p>
                </div>
              )}

              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <strong>Error Type:</strong>{' '}
                        {this.state.errorType || 'GENERIC'}
                      </div>
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Retry Count:</strong> {this.state.retryCount}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="text-xs mt-2 overflow-auto max-h-40 bg-background p-2 rounded border">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="text-xs mt-2 overflow-auto max-h-40 bg-background p-2 rounded border">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for manually reporting errors
export const useErrorHandler = () => {
  const reportError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // In a real application, send to error monitoring service
    // errorMonitoringService.captureException(error, { context });
  };

  return { reportError };
};
