-- Insert 5 users  
INSERT INTO users (username, password) VALUES
('alice_tan', 'password123'),
('bob_lee', 'password123'),
('carol_ng', 'password123'),
('david_lim', 'password123'),
('emma_wong', 'password123')
ON CONFLICT (username) DO NOTHING;

DO $$
DECLARE
    alice_id INT; bob_id INT; carol_id INT; david_id INT; emma_id INT;
    cs2030_id UUID; cs2040_id UUID; cs2100_id UUID; cs2103t_id UUID; cs2106_id UUID;
BEGIN
    -- Get user IDs
    SELECT user_id INTO alice_id FROM users WHERE username = 'alice_tan';
    SELECT user_id INTO bob_id FROM users WHERE username = 'bob_lee';
    SELECT user_id INTO carol_id FROM users WHERE username = 'carol_ng';
    SELECT user_id INTO david_id FROM users WHERE username = 'david_lim';
    SELECT user_id INTO emma_id FROM users WHERE username = 'emma_wong';
    
    -- Get module IDs
    SELECT module_id INTO cs2030_id FROM modules WHERE module_code = 'CS2030';
    SELECT module_id INTO cs2040_id FROM modules WHERE module_code = 'CS2040';
    SELECT module_id INTO cs2100_id FROM modules WHERE module_code = 'CS2100';
    SELECT module_id INTO cs2103t_id FROM modules WHERE module_code = 'CS2103T';
    SELECT module_id INTO cs2106_id FROM modules WHERE module_code = 'CS2106';
    
    -- Subscribe users to modules (3 each)
    INSERT INTO user_modules VALUES (alice_id, cs2030_id), (alice_id, cs2040_id), (alice_id, cs2100_id) ON CONFLICT DO NOTHING;
    INSERT INTO user_modules VALUES (bob_id, cs2040_id), (bob_id, cs2103t_id), (bob_id, cs2106_id) ON CONFLICT DO NOTHING;
    INSERT INTO user_modules VALUES (carol_id, cs2030_id), (carol_id, cs2103t_id), (carol_id, cs2106_id) ON CONFLICT DO NOTHING;
    INSERT INTO user_modules VALUES (david_id, cs2040_id), (david_id, cs2100_id), (david_id, cs2106_id) ON CONFLICT DO NOTHING;
    INSERT INTO user_modules VALUES (emma_id, cs2030_id), (emma_id, cs2100_id), (emma_id, cs2103t_id) ON CONFLICT DO NOTHING;
    
    -- Create 3 posts per user (15 posts total)
    INSERT INTO posts (user_id, title, body, module_id) VALUES 
    (alice_id, 'Need help with Java streams', 'Anyone explain streams API?', cs2030_id),
    (alice_id, 'BST balancing question', 'How to balance a BST efficiently?', cs2040_id),
    (alice_id, 'Cache memory confusion', 'What is L1 vs L2 cache?', cs2100_id);
    
    INSERT INTO posts (user_id, title, body, module_id) VALUES 
    (bob_id, 'Stack implementation', 'Best way to implement stack?', cs2040_id),
    (bob_id, 'Git branching help', 'When to create new branch?', cs2103t_id),
    (bob_id, 'Process vs Thread', 'What is the difference?', cs2106_id);
    
    INSERT INTO posts (user_id, title, body, module_id) VALUES 
    (carol_id, 'Lambda syntax', 'How do lambdas work in Java?', cs2030_id),
    (carol_id, 'UML diagrams', 'Class diagram best practices?', cs2103t_id),
    (carol_id, 'Deadlock conditions', 'What causes deadlock?', cs2106_id);
    
    INSERT INTO posts (user_id, title, body, module_id) VALUES 
    (david_id, 'Sorting complexity', 'Which sort is O(n log n)?', cs2040_id),
    (david_id, 'Assembly basics', 'How to read MIPS?', cs2100_id),
    (david_id, 'Semaphores', 'When to use semaphores?', cs2106_id);
    
    INSERT INTO posts (user_id, title, body, module_id) VALUES 
    (emma_id, 'Functional programming', 'What is immutability?', cs2030_id),
    (emma_id, 'Computer architecture', 'RISC vs CISC?', cs2100_id),
    (emma_id, 'Software testing', 'Unit vs integration tests?', cs2103t_id);
    
    -- Create 3 comments per user (15 comments total)
    INSERT INTO comments (post_id, user_id, body) VALUES 
    ((SELECT post_id FROM posts WHERE title = 'Lambda syntax' LIMIT 1), alice_id, 'Check the lecture slides!'),
    ((SELECT post_id FROM posts WHERE title = 'Stack implementation' LIMIT 1), alice_id, 'Use ArrayList for backing'),
    ((SELECT post_id FROM posts WHERE title = 'Sorting complexity' LIMIT 1), alice_id, 'Merge sort and quicksort');
    
    INSERT INTO comments (post_id, user_id, body) VALUES 
    ((SELECT post_id FROM posts WHERE title = 'Need help with Java streams' LIMIT 1), bob_id, 'Practice with examples'),
    ((SELECT post_id FROM posts WHERE title = 'UML diagrams' LIMIT 1), bob_id, 'Tutorial covers this well'),
    ((SELECT post_id FROM posts WHERE title = 'Computer architecture' LIMIT 1), bob_id, 'Chapter 2 explains it');
    
    INSERT INTO comments (post_id, user_id, body) VALUES 
    ((SELECT post_id FROM posts WHERE title = 'BST balancing question' LIMIT 1), carol_id, 'AVL trees help'),
    ((SELECT post_id FROM posts WHERE title = 'Git branching help' LIMIT 1), carol_id, 'Feature branch workflow'),
    ((SELECT post_id FROM posts WHERE title = 'Assembly basics' LIMIT 1), carol_id, 'Lab exercises are useful');
    
    INSERT INTO comments (post_id, user_id, body) VALUES 
    ((SELECT post_id FROM posts WHERE title = 'Cache memory confusion' LIMIT 1), david_id, 'L1 is faster but smaller'),
    ((SELECT post_id FROM posts WHERE title = 'Process vs Thread' LIMIT 1), david_id, 'Threads share memory'),
    ((SELECT post_id FROM posts WHERE title = 'Functional programming' LIMIT 1), david_id, 'No side effects!');
    
    INSERT INTO comments (post_id, user_id, body) VALUES 
    ((SELECT post_id FROM posts WHERE title = 'Deadlock conditions' LIMIT 1), emma_id, 'Four conditions needed'),
    ((SELECT post_id FROM posts WHERE title = 'Semaphores' LIMIT 1), emma_id, 'For synchronization'),
    ((SELECT post_id FROM posts WHERE title = 'Software testing' LIMIT 1), emma_id, 'Both are important');
    
END $$;
