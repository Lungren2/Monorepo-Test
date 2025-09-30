import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth';
import type { NavigationItem } from '../types';
import { ALL_NAVIGATION_ITEMS } from '../constants/navigation';

export const useNavigation = () => {
  const location = useLocation();
  const { hasRole } = useAuth();

  const getFilteredNavigationItems = (): NavigationItem[] => {
    return ALL_NAVIGATION_ITEMS.filter((item) =>
      item.roles.some((role) => hasRole(role))
    );
  };

  const isActiveRoute = (href: string): boolean => {
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const getActiveNavigationItem = (): NavigationItem | undefined => {
    return getFilteredNavigationItems().find((item) =>
      isActiveRoute(item.href)
    );
  };

  return {
    navigationItems: getFilteredNavigationItems(),
    isActiveRoute,
    getActiveNavigationItem,
    currentPath: location.pathname,
  };
};
