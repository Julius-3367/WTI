-- DropForeignKey
ALTER TABLE `activity_logs` DROP FOREIGN KEY `activity_logs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_roleId_fkey`;
