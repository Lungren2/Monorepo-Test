/* =============================================================================
 * Migration: V2__audit_function
 * Created   : 2025-01-03
 * Database  : PostgreSQL (primary), SQL Server (commented alternatives)
 * -----
 * Purpose:
 *  - Reusable audit trigger function for PostgreSQL
 *  - Automatically updates `updated_at` timestamp
 *  - SQL Server equivalent pattern provided in comments
 * =============================================================================
 */

-- ===================================
-- PostgreSQL: Audit Trigger Function
-- ===================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usage Example (commented):
-- After creating a table with created_at and updated_at columns:
/*
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
*/

/* ===================================
   SQL Server: Audit Trigger Pattern
   ===================================

-- SQL Server uses table-specific triggers, not reusable functions
-- Example trigger for a table named 'users':

CREATE TRIGGER trg_users_update_timestamp
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE u
    SET updated_at = GETUTCDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id
    WHERE u.updated_at = i.updated_at;  -- Only if not already updated
END;
GO

-- Note: SQL Server triggers are table-specific
-- Copy and adapt this pattern for each table needing audit timestamps
*/


