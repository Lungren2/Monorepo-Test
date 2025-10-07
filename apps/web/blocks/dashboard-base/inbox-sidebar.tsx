/* =============================================================================
 * CONTEXT: blocks/dashboard-base
 * PATTERN: conditional-sidebar
 * DEPENDS_ON: @/components/ui/sidebar, @/components/ui/label, @/components/ui/switch, hooks, types, constants
 * USED_BY: app-sidebar.tsx
 * -----
 * Inbox sidebar component for dashboard-base. Displays mail list with search
 * and unread toggle. Renders conditionally when inbox is selected.
 * =============================================================================
 */

"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

import { InboxSidebarProps } from "./types"
import { useInbox } from "./hooks/useInbox"
import { MAIL_CONFIG, CSS_CLASSES, SIDEBAR_CONFIG } from "./constants"

export function InboxSidebar({ mails, onMailClick }: InboxSidebarProps) {
  const { isMobile } = useSidebar()
  const { filteredMails, searchQuery, showUnreadsOnly, setSearchQuery, setShowUnreadsOnly } = useInbox(mails)

  return (
    <Sidebar collapsible={SIDEBAR_CONFIG.INBOX_COLLAPSIBLE_MODE} className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium">Inbox</div>
          <Label className="flex items-center gap-2 text-sm">
            <span>{MAIL_CONFIG.UNREAD_LABEL}</span>
            <Switch 
              className="shadow-none" 
              checked={showUnreadsOnly}
              onCheckedChange={setShowUnreadsOnly}
            />
          </Label>
        </div>
        <SidebarInput 
          placeholder={MAIL_CONFIG.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {filteredMails.map((mail) => (
              <a
                href="#"
                key={mail.email}
                className={CSS_CLASSES.MAIL_ITEM}
                onClick={(e) => {
                  e.preventDefault()
                  onMailClick?.(mail)
                }}
              >
                <div className="flex w-full items-center gap-2">
                  <span>{mail.name}</span>{" "}
                  <span className="ml-auto text-xs">{mail.date}</span>
                </div>
                <span className="font-medium">{mail.subject}</span>
                <span className={CSS_CLASSES.MAIL_PREVIEW}>
                  {mail.teaser}
                </span>
              </a>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
