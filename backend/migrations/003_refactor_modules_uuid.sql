-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create new modules table with UUID
CREATE TABLE IF NOT EXISTS modules_new (
    module_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_code VARCHAR(50) NOT NULL UNIQUE,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migrate existing module data with generated UUIDs
INSERT INTO modules_new (module_id, module_code, module_title, description)
SELECT 
    uuid_generate_v4(),
    module_title as module_code,
    module_title,
    description
FROM modules;

-- Create temporary mapping table for posts migration
CREATE TEMP TABLE module_id_mapping AS
SELECT 
    m_old.module_id as old_id,
    m_new.module_id as new_id
FROM modules m_old
JOIN modules_new m_new ON m_old.module_title = m_new.module_code;

-- Create new posts table with UUID foreign key
CREATE TABLE IF NOT EXISTS posts_new (
    post_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    module_id UUID NOT NULL REFERENCES modules_new(module_id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0
);

-- Migrate posts data
INSERT INTO posts_new (post_id, user_id, title, body, module_id, created_at, updated_at, deleted_at, like_count, comment_count)
SELECT 
    p.post_id,
    p.user_id,
    p.title,
    p.body,
    m.new_id,
    p.created_at,
    p.updated_at,
    p.deleted_at,
    p.like_count,
    p.comment_count
FROM posts p
JOIN module_id_mapping m ON p.module_id = m.old_id;

-- Create new user_modules table with UUID foreign key
CREATE TABLE IF NOT EXISTS user_modules_new (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules_new(module_id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, module_id)
);

-- Migrate user_modules data
INSERT INTO user_modules_new (user_id, module_id)
SELECT 
    um.user_id,
    m.new_id
FROM user_modules um
JOIN module_id_mapping m ON um.module_id = m.old_id;

-- Drop old tables (CASCADE to handle dependencies)
DROP TABLE IF EXISTS user_modules CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- Rename new tables
ALTER TABLE modules_new RENAME TO modules;
ALTER TABLE posts_new RENAME TO posts;
ALTER TABLE user_modules_new RENAME TO user_modules;

-- Recreate comments table (it was dropped with CASCADE)
CREATE TABLE IF NOT EXISTS comments (
    comment_id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE RESTRICT,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    like_count INT DEFAULT 0
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_module_id ON posts(module_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_user_id ON user_modules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_module_id ON user_modules(module_id);
CREATE INDEX IF NOT EXISTS idx_modules_code ON modules(module_code);
