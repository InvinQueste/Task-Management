CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
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

INSERT IGNORE INTO users (id, username, password, created_at) VALUES
(900, 'Harry', '$2y$10$MM0Zax7aXiUyyS8WaWEuj.7EicuE4aY6Inu1Z/peVuSeLDDJ5Wxvy', '2025-05-25 04:45:00'), -- password: potter
(901, 'Ron', '$2y$10$U4MDhAEZ8Lahi.6O7XOFiukDXbY3X0M3Gt0qGER3sF3XfzWIYMSJa', '2025-05-27 09:00:00'), -- password: weasley
(902, 'Hermione', '$2y$10$6t8t4zuH3EHEsYl9Rb2dBetXKBW9ShSNzf/HgZH.z.eynRpto1fwa', '2025-05-29 04:15:00'); -- password: granger

INSERT IGNORE INTO tasks (id, user_id, title, description, due_date, priority, is_completed, created_at, updated_at) VALUES
(800, 900, 'Buy groceries', 'Milk, eggs, bread', '2025-06-03', 'High', 0, '2025-05-01 14:39:19', '2025-06-03 14:39:19'),
(801, 900, 'Doctor appointment', 'Checkup at 4 PM', '2025-06-02', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(802, 900, 'Finish project report', 'Due by end of week', '2025-06-07', 'High', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(803, 901, 'Call plumber', 'Fix kitchen sink leak', '2025-06-04', 'Low', 1, '2025-06-01 14:39:19', '2025-06-03 14:39:19'),
(804, 901, 'Gym session', 'Leg day workout', '2025-06-02', 'Medium', 0, '2025-06-10 14:39:19', '2025-06-03 14:39:19'),
(805, 901, 'Read book', 'Finish chapter 5 of Sapiens', '2025-06-05', 'Low', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(806, 902, 'Team meeting', 'Discuss Q2 targets', '2025-06-02', 'High', 1, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(807, 902, 'Code review', 'Review merge request #42', '2025-06-03', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(808, 902, 'Backup files', 'Weekly system backup', '2025-06-01', 'Low', 1, '2025-06-03 14:39:19', '2025-06-03 14:39:19'),
(809, 902, 'Plan trip', 'Research destinations for vacation', '2025-06-10', 'Medium', 0, '2025-06-03 14:39:19', '2025-06-03 14:39:19');