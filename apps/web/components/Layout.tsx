import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth, useSessionTimeout } from '@/components/auth';
import { SidebarNavigation } from '@/components/navigation';
import ThemeToggle from '@/components/ui/theme-toggle';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/navigation';
import { SESSION_CONFIG, UI } from '@/lib/constants';
import { OchreBackground } from './ui/background';

interface LayoutProps {
  children?: React.ReactNode;
}

// Sub-component for the top bar
const TopBar: React.FC = () => (
  <div
    className={`flex ${UI.TOP_BAR_HEIGHT} shrink-0 items-center justify-between gap-2 px-4`}
  >
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <SidebarSeparator className="mx-2" />
    </div>
    <div className="flex items-center gap-3">
      <ThemeToggle />
    </div>
  </div>
);

// Sub-component for unauthenticated layout
const UnauthenticatedLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen bg-background/50 backdrop-filter backdrop-blur-md">
    {children || <Outlet />}
  </div>
);

// Sub-component for authenticated layout
const AuthenticatedLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <SidebarProvider>
    <OchreBackground>
      <div className="flex h-screen w-full">
        <Sidebar
          className="bg-background/50 backdrop-filter backdrop-blur-md border-r-2 border-border/50"
          variant={UI.SIDEBAR_VARIANT}
          collapsible={UI.SIDEBAR_COLLAPSIBLE}
        >
          <SidebarNavigation />
        </Sidebar>

        <SidebarInset>
          <TopBar />
          <div className="flex-1 overflow-auto">{children || <Outlet />}</div>
        </SidebarInset>
      </div>
    </OchreBackground>
  </SidebarProvider>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Initialize session timeout management
  useSessionTimeout(SESSION_CONFIG);

  return isAuthenticated ? (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  ) : (
    <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
  );
};

export default Layout;
