/* =============================================================================
 * CONTEXT: blocks/dashboard-base/hooks
 * PATTERN: state-management-hook
 * DEPENDS_ON: React, types, data
 * USED_BY: inbox-sidebar component
 * -----
 * Inbox state management hook.
 * Handles mail filtering, search, and unread toggle functionality.
 * =============================================================================
 */

import { useState, useMemo, useCallback } from 'react';
import { UseInboxState, Mail } from '../types';
import { mails } from '../data';

export function useInbox(initialMails: Mail[] = mails): UseInboxState {
  const [mailsList, setMailsList] = useState<Mail[]>(initialMails);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUnreadsOnly, setShowUnreadsOnly] = useState<boolean>(false);

  const filteredMails = useMemo(() => {
    let filtered = mailsList;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mail => 
        mail.name.toLowerCase().includes(query) ||
        mail.subject.toLowerCase().includes(query) ||
        mail.teaser.toLowerCase().includes(query)
      );
    }

    // Apply unread filter (mock implementation - in real app, you'd have unread status)
    if (showUnreadsOnly) {
      // For demo purposes, consider mails from today as "unread"
      const today = new Date().toDateString();
      filtered = filtered.filter(mail => {
        // Simple heuristic: if date contains "AM" or "PM", it's from today
        return mail.date.includes('AM') || mail.date.includes('PM');
      });
    }

    return filtered;
  }, [mailsList, searchQuery, showUnreadsOnly]);

  const filterMails = useCallback(() => {
    // This function can be used to trigger additional filtering logic
    // For now, the filtering is handled by the useMemo above
  }, []);

  return {
    mails: mailsList,
    filteredMails,
    searchQuery,
    showUnreadsOnly,
    setSearchQuery,
    setShowUnreadsOnly,
    filterMails,
  };
}
