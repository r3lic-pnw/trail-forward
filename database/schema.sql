CREATE DATABASE IF NOT EXISTS trail_forward;
--
USE trail_forward;
--
CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        date DATETIME,
        location VARCHAR(100),
        description VARCHAR(1024)
    )