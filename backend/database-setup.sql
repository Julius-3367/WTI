-- =====================================================
-- LABOUR MOBILITY DATABASE SETUP
-- =====================================================
-- Run these commands in MariaDB/MySQL as root user
-- to create the database and user for the application

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS labour_mobility_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Create the user
CREATE USER IF NOT EXISTS 'labour_user'@'localhost' 
IDENTIFIED BY 'StrongPassword123';

-- 3. Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON labour_mobility_db.* 
TO 'labour_user'@'localhost';

-- 4. Apply the privileges
FLUSH PRIVILEGES;

-- 5. Verify the setup (optional)
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'labour_user';

-- =====================================================
-- ALTERNATIVE: If you want to use root user instead
-- =====================================================
-- Uncomment the line below in .env if using root:
-- DATABASE_URL="mysql://root:your_root_password@localhost:3306/labour_mobility_db"

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
-- If you get "Access denied" errors:
-- 1. Make sure MariaDB/MySQL is running: sudo systemctl status mariadb
-- 2. Connect as root: mysql -u root -p
-- 3. Run the above SQL commands
-- 4. Test connection: mysql -u labour_user -p labour_mobility_db
