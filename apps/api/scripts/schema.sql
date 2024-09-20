ALTER TABLE organizations
ALTER COLUMN organization_id SET DATA TYPE SERIAL,
ADD CONSTRAINT unique_organization_id UNIQUE (organization_id);

-- CREATE TABLE IF NOT EXISTS tenants (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) UNIQUE NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(30) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS tenantUsers (
--     tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
--     user_id VARCHAR(30) REFERENCES users(id) ON DELETE CASCADE,
--     role VARCHAR(50) NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
--     PRIMARY KEY (tenant_id, user_id)
-- );

-- CREATE TABLE IF NOT EXISTS blogs (
--     id SERIAL PRIMARY KEY,
--     tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
--     author_id VARCHAR(30) REFERENCES users(id),
--     title VARCHAR(255) NOT NULL,
--     content TEXT NOT NULL,
--     status VARCHAR(50) NOT NULL,
--     publish_date TIMESTAMP,
--     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMP NOT NULL DEFAULT NOW()
-- );

-- DROP TABLE IF EXISTS tenants CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS tanentUsers CASCADE;
-- DROP TABLE IF EXISTS blogs CASCADE;
