import React from 'react';
import { Link } from 'react-router-dom';
import { RobotIcon } from '@/components/loading-screen';
import { SIDEBAR_UI } from '../constants/ui';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed }) => {
  return (
    <div className={`p-4 ${SIDEBAR_UI.TRANSITIONS.DEFAULT}`}>
      <Link
        to="/"
        className={`flex items-center justify-center ${SIDEBAR_UI.TRANSITIONS.DEFAULT}`}
      >
        <div className="relative flex flex-col items-center justify-center">
          {!isCollapsed && <h3 className="-mb-8 text-lg">ROBOT</h3>}
          <RobotIcon
            className={cn(
              `${SIDEBAR_UI.TRANSITIONS.DEFAULT} opacity-100 scale-100 relative -mb-2 h-auto`,
              isCollapsed ? 'w-20' : 'w-24'
            )}
            rotate={isCollapsed ? 90 : 0}
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
      </Link>
    </div>
  );
};

export default SidebarHeader;
