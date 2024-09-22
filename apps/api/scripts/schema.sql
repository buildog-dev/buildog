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

CREATE TABLE IF NOT EXISTS organizations (
    organization_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    organization_description TEXT,
    created_by VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS organization_users (
    organization_id UUID REFERENCES organizations(organization_id) ON DELETE CASCADE,
    user_id VARCHAR(30) REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);

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
