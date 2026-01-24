-- Seed data for testing

-- Insert sample modules
INSERT INTO modules (module_title, description) VALUES
('CS2030', 'Programming Methodology II'),
('CS2040', 'Data Structures and Algorithms'),
('CS3230', 'Design and Analysis of Algorithms')
ON CONFLICT (module_title) DO NOTHING;

-- Insert sample users (password is hashed version of "password123")
INSERT INTO users (username, password) VALUES
('john_doe', 'password123'),
('jane_smith', 'password123'),
('bob_wilson', 'password123')
ON CONFLICT (username) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, title, body, module_id, like_count, comment_count) VALUES
(1, 'Welcome to CS2030!', 'Anyone else excited for this module?', 1, 5, 2),
(1, 'Need help with vim', 'Can someone explain why i cannot run?', 1, 3, 0),
(2, 'Tips for CS2040?', 'Any seniors with advice for doing well in this module?', 2, 8, 1)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (post_id, user_id, body, like_count) VALUES
(1, 2, 'Great post! I''m also taking this module.', 2),
(1, 3, 'Looking forward to the first lecture!', 1),
(3, 1, 'Practice your coding problems on LeetCode!', 3)
ON CONFLICT DO NOTHING;
