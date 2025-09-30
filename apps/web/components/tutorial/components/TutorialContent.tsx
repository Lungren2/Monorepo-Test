import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { TutorialStep, TutorialContext } from '../types';
import { SpotlightRect } from '../types';
import { chooseSide, createAnchorStyle } from '../utils/positioning';
import { Z_POPOVER } from '../constants';

interface TutorialContentProps {
  step: TutorialStep;
  context: TutorialContext;
  rect: SpotlightRect;
  renderContent?: (step: TutorialStep, ctx: TutorialContext) => React.ReactNode;
}

export function TutorialContent({
  step,
  context,
  rect,
  renderContent,
}: TutorialContentProps) {
  const computedSide = step.side ?? chooseSide(rect);
  const anchorStyle = createAnchorStyle(rect, Z_POPOVER);

  function DefaultContent() {
    return (
      <div className="space-y-3">
        {step.title && (
          <div className="font-semibold leading-none">{step.title}</div>
        )}
        {step.body && (
          <div className="text-sm text-muted-foreground">{step.body}</div>
        )}

        {/* Progress bar */}
        <div className="h-1 w-full rounded bg-muted">
          <div
            className="h-1 rounded bg-primary transition-all"
            style={{ width: `${((context.index + 1) / context.total) * 100}%` }}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={context.prev}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            Prev
          </button>
          <button
            onClick={context.atEnd ? context.close : context.next}
            className="rounded-md border bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            {context.atEnd ? 'Done' : 'Next'}
          </button>
          <button
            onClick={context.close}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <Popover open>
      <PopoverPrimitive.Anchor style={anchorStyle} />
      <PopoverContent
        align="center"
        side={computedSide}
        style={{ zIndex: Z_POPOVER }}
      >
        {renderContent ? renderContent(step, context) : <DefaultContent />}
      </PopoverContent>
    </Popover>
  );
}
