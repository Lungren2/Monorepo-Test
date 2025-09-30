import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth';
import {
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/navigation';
import { useNavigation } from '../hooks/useNavigation';
import NavigationMenu from './NavigationMenu';
import UserProfile from './UserProfile';
import EntitySelector from './EntitySelector';
import { WinningFormBadge } from '@/components/loading-screen';

const SidebarNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { navigationItems, isActiveRoute } = useNavigation();

  const isCollapsed = !open;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <SidebarHeader isCollapsed={isCollapsed} />

      <EntitySelector
        isCollapsed={isCollapsed}
        onEntityChange={(entity) => {
          // Store selected entity in localStorage for persistence
          localStorage.setItem('selectedEntity', JSON.stringify(entity));
        }}
      />

      <NavigationMenu
        items={navigationItems}
        isCollapsed={isCollapsed}
        isActiveRoute={isActiveRoute}
      />

      <SidebarFooter className="transition-all duration-300 ease-in-out">
        <UserProfile
          user={{
            display_name: user.display_name,
            email: user.email,
            avatar_url: user.avatar_url,
          }}
          isCollapsed={isCollapsed}
          onLogout={handleLogout}
        />
        {!isCollapsed && <WinningFormBadge />}
      </SidebarFooter>
    </>
  );
};

export default SidebarNavigation;
