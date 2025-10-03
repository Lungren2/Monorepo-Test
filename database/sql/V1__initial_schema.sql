/* =============================================================================
 * Migration: V1__initial_schema
 * Created   : 2025-01-03
 * Database  : PostgreSQL (primary), SQL Server (commented alternatives)
 * -----
 * Purpose:
 *  - Initialize database extensions and schema
 *  - Empty baseline for projects to add domain-specific tables
 * =============================================================================
 */

-- ===================================
-- PostgreSQL: Enable UUID extension
-- ===================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/*
-- ===================================
-- SQL Server: UUID Alternative
-- ===================================
-- SQL Server has built-in NEWID() and NEWSEQUENTIALID()
-- No extension needed
*/

-- ===================================
-- Projects add domain tables here
-- ===================================

-- Example table structure (commented):
/*
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- PostgreSQL
    -- id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),  -- SQL Server
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
*/


