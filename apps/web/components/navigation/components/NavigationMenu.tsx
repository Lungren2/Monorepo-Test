import React from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
} from '@/components/navigation';
import NavigationItem from './NavigationItem';
import type { NavigationItem as NavigationItemType } from '../types';
import { SIDEBAR_UI } from '../constants/ui';

interface NavigationMenuProps {
  items: NavigationItemType[];
  isCollapsed: boolean;
  isActiveRoute: (href: string) => boolean;
  onItemClick?: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  isCollapsed,
  isActiveRoute,
  onItemClick,
}) => {
  return (
    <SidebarContent className={SIDEBAR_UI.TRANSITIONS.DEFAULT}>
      <SidebarGroup className={SIDEBAR_UI.TRANSITIONS.DEFAULT}>
        <SidebarMenu className={SIDEBAR_UI.SPACING.ITEM_GAP}>
          {items.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={isActiveRoute(item.href)}
              isCollapsed={isCollapsed}
              {...(onItemClick && { onClick: onItemClick })}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default NavigationMenu;
