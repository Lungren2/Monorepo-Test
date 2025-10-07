/* =============================================================================
 * CONTEXT: blocks/dashboard-base/types
 * PATTERN: type-definitions
 * DEPENDS_ON: React, Lucide React
 * USED_BY: dashboard-base components, hooks, and data
 * -----
 * Type definitions for dashboard-base functionality.
 * Provides type safety and clear interfaces for all dashboard components.
 * =============================================================================
 */

import { LucideIcon } from 'lucide-react';

// User and authentication types
export interface User {
  name: string;
  email: string;
  avatar: string;
}

// Team and organization types
export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

// Navigation types
export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
}

// Project types
export interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
}

// Mail types
export interface Mail {
  name: string;
  email: string;
  subject: string;
  date: string;
  teaser: string;
}

// Dashboard data structure
export interface DashboardData {
  user: User;
  teams: Team[];
  navMain: NavItem[];
  projects: Project[];
  mails: Mail[];
}

// Component prop types
export interface NavMainProps {
  items: NavItem[];
  onItemClick?: (title: string) => void;
}

export interface NavProjectsProps {
  projects: Project[];
}

export interface NavUserProps {
  user: User;
}

export interface TeamSwitcherProps {
  teams: Team[];
}

export interface InboxSidebarProps {
  mails?: Mail[];
  onMailClick?: (mail: Mail) => void;
}

export interface AppSidebarProps extends React.ComponentProps<'div'> {
  data?: DashboardData;
  onNavItemClick?: (title: string) => void;
}

// Hook return types
export interface UseDashboardState {
  activeNavItem: string;
  isInboxActive: boolean;
  setActiveNavItem: (item: string) => void;
  toggleInbox: () => void;
}

export interface UseInboxState {
  mails: Mail[];
  filteredMails: Mail[];
  searchQuery: string;
  showUnreadsOnly: boolean;
  setSearchQuery: (query: string) => void;
  setShowUnreadsOnly: (show: boolean) => void;
  filterMails: () => void;
}

// Event handler types
export type NavItemClickHandler = (title: string) => void;
export type MailClickHandler = (mail: Mail) => void;
export type TeamSelectHandler = (team: Team) => void;
