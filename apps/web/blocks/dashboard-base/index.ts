/* =============================================================================
 * CONTEXT: blocks/dashboard-base
 * PATTERN: main-component-exports
 * DEPENDS_ON: Main dashboard components
 * USED_BY: External consumers of dashboard-base functionality
 * -----
 * Main export file for dashboard-base block.
 * Exports only the main components - use direct imports for hooks, types, data, and constants.
 * =============================================================================
 */

// Main components only - use direct imports for other modules
export { AppSidebar } from './app-sidebar';
export { InboxSidebar } from './inbox-sidebar';
export { NavMain } from './nav-main';
export { NavProjects } from './nav-projects';
export { NavUser } from './nav-user';
export { TeamSwitcher } from './team-switcher';
