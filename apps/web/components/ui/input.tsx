import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type prefStoreType = { isShowing: boolean };

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const raw = localStorage.getItem('prefStore');
    const emptyRaw = raw ?? JSON.stringify({} as prefStoreType);
    const pref: prefStoreType = JSON.parse(raw ?? emptyRaw);
    const [isShowing, setIsShowing] = React.useState<boolean>(
      pref.isShowing ?? false
    );

    React.useEffect(() => {
      localStorage.setItem(
        'prefStore',
        JSON.stringify({
          isShowing: isShowing,
        })
      );
    }, [isShowing]);

    if (type === 'password') {
      return (
        <span className="flex w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
          <input
            type={isShowing ? 'text' : type}
            className={cn(
              'w-full h-10 px-3 py-2 outline-none bg-transparent',
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            aria-label={isShowing ? 'Hide password' : 'Show password'}
            type="button"
            onClick={() => setIsShowing((prev) => !prev)}
            className={cn(
              'pr-3 transition-colors',
              isShowing ? 'text-muted-foreground' : 'text-primary'
            )}
          >
            {isShowing ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </button>
        </span>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
