-- Create user_post_likes table to track which users liked which posts
CREATE TABLE IF NOT EXISTS user_post_likes (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);
