/* =============================================================================
 * CONTEXT: blocks/dashboard-base
 * PATTERN: main-sidebar-component
 * DEPENDS_ON: @/components/ui/sidebar, hooks, data, types, constants
 * USED_BY: dashboard-base page
 * -----
 * Main sidebar component for dashboard-base. Manages navigation state and
 * conditionally renders inbox sidebar when inbox is selected.
 * =============================================================================
 */

"use client"

import * as React from "react"

import { InboxSidebar } from "@/blocks/dashboard-base/inbox-sidebar"
import { NavMain } from "@/blocks/dashboard-base/nav-main"
import { NavProjects } from "@/blocks/dashboard-base/nav-projects"
import { NavUser } from "@/blocks/dashboard-base/nav-user"
import { TeamSwitcher } from "@/blocks/dashboard-base/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { dashboardData } from "./data"
import { useDashboard } from "./hooks/useDashboard"
import { AppSidebarProps } from "./types"
import { CSS_CLASSES, SIDEBAR_CONFIG } from "./constants"


export function AppSidebar({ data = dashboardData, onNavItemClick, ...props }: AppSidebarProps) {
  const { activeNavItem, isInboxActive, setActiveNavItem } = useDashboard()

  const handleNavItemClick = (title: string) => {
    setActiveNavItem(title)
    onNavItemClick?.(title)
  }

  return (
    <Sidebar
      collapsible={SIDEBAR_CONFIG.COLLAPSIBLE_MODE}
      className={isInboxActive ? CSS_CLASSES.SIDEBAR_OVERFLOW : ""}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onItemClick={handleNavItemClick} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
      {isInboxActive && <InboxSidebar mails={data.mails} />}
    </Sidebar>
  )
}
