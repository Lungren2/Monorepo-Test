import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import type { UserProfileProps } from '../types';
import { SIDEBAR_UI } from '../constants/ui';

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isCollapsed,
  onLogout,
}) => {
  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isCollapsed) {
    return (
      <div className="flex justify-center p-4 bg-sidebar/30 backdrop-filter backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 ease-in-out"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-sidebar/30 backdrop-filter backdrop-blur-sm ${SIDEBAR_UI.TRANSITIONS.DEFAULT}`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-1 h-auto w-full hover:bg-sidebar-accent/50 transition-all duration-300 ease-in-out"
          >
            <Avatar className="h-8 w-8 transition-all duration-300 ease-in-out">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="text-xs font-medium">
                {getInitials(user.display_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 transition-all duration-300 ease-in-out">
              <div className="text-sm font-medium leading-tight truncate max-w-[120px]">
                {user.display_name}
              </div>
              <div className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">
                {user.email}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 transition-all duration-200 ease-in-out"
          sideOffset={8}
        >
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="text-xs font-medium">
                {getInitials(user.display_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.display_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
