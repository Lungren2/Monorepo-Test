import * as React from 'react';
import { cn } from '@/lib/utils';

type PasswordStrengthProps = {
  password: string;
  minLength?: number; // default 8
  className?: string;
  title?: string; // heading text, defaults below
};

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

/** Core scoring (0..5) */
export function getPasswordStrength(password: string, minLength = 8): number {
  let strength = 0;
  if (password.length === 0) return -1;
  if (password.length >= minLength) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  return strength;
}

/** Individual requirement checks */
const makeCriteria = (minLength: number) => [
  {
    label: `At least ${minLength} characters long`,
    ok: (pw: string) => pw.length >= minLength,
  },
  {
    label: 'Contains uppercase and lowercase letters',
    ok: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
  { label: 'Contains at least one number', ok: (pw: string) => /\d/.test(pw) },
  {
    label: 'Contains at least one special character',
    ok: (pw: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
  },
  // Split-case version (optional): keep if you prefer 5 distinct checks
  // { label: "Contains lowercase letter", ok: (pw: string) => /[a-z]/.test(pw) },
  // { label: "Contains uppercase letter", ok: (pw: string) => /[A-Z]/.test(pw) },
];

/** Map score -> overall text color using your CSS vars */
function toneClass(score: number) {
  // 0-2 => red, 3 => yellow, 4-5 => green
  if (score === -1) return 'text-inhert';
  if (score <= 2) return 'text-[hsl(var(--wf-red))]';
  if (score === 3) return 'text-[hsl(var(--wf-yellow))]';
  return 'text-[hsl(var(--wf-green))]';
}

export default function PasswordStrength({
  password,
  minLength = 8,
  className = '',
  title = 'Password',
}: PasswordStrengthProps) {
  const criteria = React.useMemo(() => makeCriteria(minLength), [minLength]);

  // Score from the 5-rule system you supplied (length, lower, upper, number, special)
  const score = getPasswordStrength(password, minLength);
  const label =
    score >= 0
      ? (strengthLabels[Math.max(0, Math.min(4, score - 1))] ?? 'Very Weak')
      : 'Provide';

  // aria-live so screen readers announce strength changes
  const liveLabel = `Password strength: ${label}. ${score} of 5 checks passed.`;

  return (
    <div
      className={`pt-1 text-sm transition-all duration-500 ease-in-out ${className}`}
    >
      {/* Requirements list */}
      <div
        className={`flex items-center gap-1 ${toneClass(score)}`}
        aria-live="polite"
      >
        <span className="font-semibold">{label}</span>
        <p className="font-semibold">{title}:</p>
      </div>
      <ul className="list-none mt-1 space-y-1">
        {criteria.map((c, idx) => {
          const ok = c.ok(password);
          return (
            <li key={idx} className="flex items-start gap-2">
              <span
                className={`font-mono leading-5 ${
                  ok ? 'text-[hsl(var(--wf-green))]' : 'text-foreground/40'
                }`}
                aria-hidden="true"
              >
                {ok ? '●' : '○'}
              </span>
              <span
                className={ok ? 'text-foreground' : 'text-muted-foreground'}
              >
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Visually hidden status for SRs */}
      <span className="sr-only">{liveLabel}</span>
    </div>
  );
}
