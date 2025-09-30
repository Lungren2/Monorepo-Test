import { Home } from 'lucide-react';
import type { NavigationItem } from '../types';

export const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['user', 'manager', 'admin'],
    description: 'Main dashboard',
  },
];
