ALTER USER 'root'@'localhost' IDENTIFIED BY 'Jointlly2026_secure';
CREATE DATABASE IF NOT EXISTS jointlly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP USER IF EXISTS 'jointlly_user'@'localhost';
DROP USER IF EXISTS 'jointlly_user'@'127.0.0.1';
CREATE USER 'jointlly_user'@'localhost' IDENTIFIED BY 'Jointlly2026_secure';
CREATE USER 'jointlly_user'@'127.0.0.1' IDENTIFIED BY 'Jointlly2026_secure';
GRANT ALL PRIVILEGES ON jointlly.* TO 'jointlly_user'@'localhost';
GRANT ALL PRIVILEGES ON jointlly.* TO 'jointlly_user'@'127.0.0.1';
FLUSH PRIVILEGES;
