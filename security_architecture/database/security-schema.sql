-- Run this against the same hotel_booking database.
-- If the users table already exists from the database module, this adds auth fields.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer';

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('customer', 'staff', 'admin'));

-- Example: assign an existing trusted account as admin manually.
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
--
-- Do not store plain-text passwords in the database.
