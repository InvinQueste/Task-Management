CREATE DATABASE task_management;
USE task_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (id, username, password, created_at) VALUES
(10, 'Harry', '$2y$10$MM0Zax7aXiUyyS8WaWEuj.7EicuE4aY6Inu1Z/peVuSeLDDJ5Wxvy', '2025-05-25 04:45:00'), -- password: potter
(11, 'Ron', '$2y$10$U4MDhAEZ8Lahi.6O7XOFiukDXbY3X0M3Gt0qGER3sF3XfzWIYMSJa', '2025-05-27 09:00:00'), -- password: weasley
(12, 'Hermione', '$2y$10$6t8t4zuH3EHEsYl9Rb2dBetXKBW9ShSNzf/HgZH.z.eynRpto1fwa', '2025-05-29 04:15:00'); -- password: granger

INSERT INTO tasks (id, user_id, title, description, due_date, priority, is_completed, created_at, updated_at) VALUES
(9, 10, 'Buy groceries', 'Milk, eggs, bread', '2025-06-03', 'High', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(10, 10, 'Doctor appointment', 'Checkup at 4 PM', '2025-06-02', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(11, 10, 'Finish project report', 'Due by end of week', '2025-06-07', 'High', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(12, 11, 'Call plumber', 'Fix kitchen sink leak', '2025-06-04', 'Low', 1, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(13, 11, 'Gym session', 'Leg day workout', '2025-06-02', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(14, 11, 'Read book', 'Finish chapter 5 of Sapiens', '2025-06-05', 'Low', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(15, 12, 'Team meeting', 'Discuss Q2 targets', '2025-06-02', 'High', 1, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(16, 12, 'Code review', 'Review merge request #42', '2025-06-03', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(17, 12, 'Backup files', 'Weekly system backup', '2025-06-01', 'Low', 1, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(18, 12, 'Plan trip', 'Research destinations for vacation', '2025-06-10', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19');