use member_db;

-- Inserting dummy data into the member table
INSERT INTO members (member_id, user_id, password, name, email, school_name, birth, created_at) VALUES
(1, 'user001', 'pass123', 'Alice Smith', "abc@gmail.com", 'Springfield High', '1990-05-14', '2023-01-01'),
(2, 'user002', 'pass456', 'Bob Jones', "def@gmail.com", 'Riverside College', '1985-09-23', '2023-02-15'),
(3, 'user003', 'pass789', 'Carol White', "gcd@gmail.com", 'Hilltop Academy', '1992-11-10', '2023-03-20');

-- Inserting dummy data into the character table
INSERT INTO characters (character_id, member_id, exp, character_type) VALUES
(1, 1, 0, 1),
(2, 2, 100, 2),
(3, 3, 200, 1);