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
(1, 'adfa', '$2y$10$bkLoJyVXJb5FNA1uYqSFtenPmAStjDgoNEQSmOfnhW9zpotTylmMO', '2025-05-12 16:24:54'),
(2, 'adfaadfa', '$2y$10$L0iJCD4QYBt9vIHMZHqbCu2OGP.lFtDoKOzdSas.Jw2Avyu2xfWyy', '2025-05-12 16:26:28'),
(3, 'adfaadfaa', '$2y$10$.oC/N8TSVbVYn/mZlLycIu3oDl3AzbLhZwIGzfPE4K8smd/AJ.tPS', '2025-05-12 16:28:30'),
(4, 'tester', '$2y$10$zaeaf5Naralzlzw7QuOBCu2y.f7FLOUZGZ2AtnTO4aW85zYQWUMx.', '2025-05-12 16:32:32');