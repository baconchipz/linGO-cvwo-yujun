-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create Modules table
CREATE TABLE IF NOT EXISTS modules (
    module_id BIGSERIAL PRIMARY KEY,
    module_title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Create Posts table
CREATE TABLE IF NOT EXISTS posts (
    post_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    module_id BIGINT NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    like_count INT DEFAULT 0
);

-- Create User_modules junction table
CREATE TABLE IF NOT EXISTS user_modules (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    module_id BIGINT NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, module_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_module_id ON posts(module_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_user_modules_user_id ON user_modules(user_id);
CREATE INDEX idx_user_modules_module_id ON user_modules(module_id);
