import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
  description?: string;
  badge?: string | number;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export interface SidebarNavigationProps {
  className?: string;
}

export interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export interface UserProfileProps {
  user: {
    display_name: string;
    email: string;
    avatar_url?: string;
  };
  isCollapsed: boolean;
  onLogout: () => void;
}
