// Navigation Feature exports

// Components
export { default as SidebarNavigation } from './components/SidebarNavigation';
export { default as SidebarHeader } from './components/SidebarHeader';
export { default as NavigationMenu } from './components/NavigationMenu';
export { default as NavigationItem } from './components/NavigationItem';
export { default as UserProfile } from './components/UserProfile';
export { Sidebar } from './components/sidebar';
export { SidebarRail } from './components/SidebarRail';
export { SidebarTrigger } from './components/SidebarTrigger';

// Re-export sidebar components for compatibility
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from './components/sidebar';

// Contexts and Hooks
export {
  SidebarProvider,
  useSidebar,
  SidebarContext,
} from './hooks/useSidebar';
export { useNavigation } from './hooks/useNavigation';

// Types
export * from './types';

// Constants
export * from './constants/navigation';
export * from './constants/ui';
