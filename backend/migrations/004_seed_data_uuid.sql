-- Seed data for testing (UUID version)

-- Insert sample modules with module_code
INSERT INTO modules (module_code, module_title, description) VALUES
('CS2030', 'Programming Methodology II', 'Programming Methodology II'),
('CS2040', 'Data Structures and Algorithms', 'Data Structures and Algorithms'),
('CS3230', 'Design and Analysis of Algorithms', 'Design and Analysis of Algorithms'),
('CS2100', 'Computer Organisation', 'Computer Organisation'),
('CS2103T', 'Software Engineering', 'Software Engineering'),
('CS2106', 'Introduction to Operating Systems', 'Introduction to Operating Systems'),
('CS3240', 'Interaction Design', 'Interaction Design'),
('MA1521', 'Calculus for Computing', 'Calculus for Computing'),
('MA1522', 'Linear Algebra for Computing', 'Linear Algebra for Computing'),
('ST2334', 'Probability and Statistics', 'Probability and Statistics'),
('IS1108', 'Digital Ethics and Data Privacy', 'Digital Ethics and Data Privacy'),
('CS1101S', 'Programming Methodology', 'Programming Methodology'),
('CS1231S', 'Discrete Structures', 'Discrete Structures'),
('CS2101', 'Effective Communication for Computing Professionals', 'Effective Communication for Computing Professionals'),
('CS3243', 'Introduction to Artificial Intelligence', 'Introduction to Artificial Intelligence')
ON CONFLICT (module_code) DO NOTHING;

-- Insert sample users (password is hashed version of "password123")
INSERT INTO users (username, password) VALUES
('john_doe', 'password123'),
('jane_smith', 'password123'),
('bob_wilson', 'password123'),
('alice_tan', 'password123'),
('david_lim', 'password123'),
('emma_wong', 'password123'),
('frank_chen', 'password123'),
('grace_ng', 'password123'),
('henry_koh', 'password123'),
('iris_teo', 'password123'),
('jack_lee', 'password123'),
('kelly_goh', 'password123'),
('lucas_ong', 'password123')
ON CONFLICT (username) DO NOTHING;

-- Insert sample posts (using module UUIDs)
INSERT INTO posts (user_id, title, body, module_id, like_count, comment_count)
SELECT 
    1, 
    'Welcome to CS2030!', 
    'Anyone else excited for this module?', 
    module_id,
    5,
    2
FROM modules WHERE module_code = 'CS2030'
ON CONFLICT DO NOTHING;

INSERT INTO posts (user_id, title, body, module_id, like_count, comment_count)
SELECT 
    1, 
    'Need help with vim', 
    'Can someone explain why i cannot run?', 
    module_id,
    3,
    0
FROM modules WHERE module_code = 'CS2030'
ON CONFLICT DO NOTHING;

INSERT INTO posts (user_id, title, body, module_id, like_count, comment_count)
SELECT 
    2, 
    'Tips for CS2040?', 
    'Any seniors with advice for doing well in this module?', 
    module_id,
    8,
    1
FROM modules WHERE module_code = 'CS2040'
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (post_id, user_id, body, like_count)
SELECT post_id, 2, 'Great post! I''m also taking this module.', 2
FROM posts WHERE title = 'Welcome to CS2030!'
ON CONFLICT DO NOTHING;

INSERT INTO comments (post_id, user_id, body, like_count)
SELECT post_id, 3, 'Looking forward to the first lecture!', 1
FROM posts WHERE title = 'Welcome to CS2030!'
ON CONFLICT DO NOTHING;

INSERT INTO comments (post_id, user_id, body, like_count)
SELECT post_id, 1, 'Practice your coding problems on LeetCode!', 3
FROM posts WHERE title = 'Tips for CS2040?'
ON CONFLICT DO NOTHING;
