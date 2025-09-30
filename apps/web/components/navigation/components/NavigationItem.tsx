import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/navigation';
import type { NavigationItemProps } from '../types';
import { SIDEBAR_UI } from '../constants/ui';

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <SidebarMenuItem
      className={`${SIDEBAR_UI.TRANSITIONS.DEFAULT} border border-border/50 rounded-md`}
    >
      <SidebarMenuButton
        asChild
        isActive={isActive}
        {...(isCollapsed && { tooltip: item.label })}
        className={`${SIDEBAR_UI.TRANSITIONS.DEFAULT} ${SIDEBAR_UI.STATES.HOVER} ${SIDEBAR_UI.STATES.ACTIVE} border-0`}
      >
        <Link
          to={item.href}
          onClick={onClick}
          className={`flex items-center ${SIDEBAR_UI.TRANSITIONS.DEFAULT} ${
            isCollapsed
              ? SIDEBAR_UI.STATES.COLLAPSED_ICON
              : SIDEBAR_UI.STATES.EXPANDED
          }`}
        >
          <Icon
            className={`${SIDEBAR_UI.TRANSITIONS.DEFAULT} ${SIDEBAR_UI.SPACING.ICON_SIZE}`}
          />
          <span
            className={`${SIDEBAR_UI.TRANSITIONS.DEFAULT} ${
              isCollapsed
                ? SIDEBAR_UI.LAYOUT.COLLAPSED_ICON
                : SIDEBAR_UI.LAYOUT.EXPANDED_TEXT
            }`}
          >
            {item.label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default NavigationItem;
