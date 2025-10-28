/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `activity_logs_userId_fkey` ON `activity_logs`;

-- DropIndex
DROP INDEX `roles_name_key` ON `roles`;

-- DropIndex
DROP INDEX `sessions_userId_fkey` ON `sessions`;

-- DropIndex
DROP INDEX `users_roleId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `activity_logs` ADD COLUMN `module` VARCHAR(191) NULL,
    ADD COLUMN `tenantId` INTEGER NULL;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `systemRole` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tenantId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `isActive`,
    ADD COLUMN `authId` VARCHAR(191) NULL,
    ADD COLUMN `authProvider` VARCHAR(191) NOT NULL DEFAULT 'local',
    ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `tenantId` INTEGER NULL,
    ADD COLUMN `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedBy` INTEGER NULL;

-- CreateTable
CREATE TABLE `tenants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `branding` JSON NULL,
    `contactInfo` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenants_name_key`(`name`),
    UNIQUE INDEX `tenants_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tenants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_tenants_userId_tenantId_key`(`userId`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `agentCode` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `idOrBusinessCertUrl` VARCHAR(191) NULL,
    `dateJoined` DATETIME(3) NULL,
    `feePerCandidate` DECIMAL(12, 2) NULL,
    `paymentTerms` VARCHAR(191) NULL,
    `discountRate` DOUBLE NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `agents_tenantId_name_idx`(`tenantId`, `name`),
    UNIQUE INDEX `agents_tenantId_agentCode_key`(`tenantId`, `agentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brokers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brokerCode` VARCHAR(191) NOT NULL,
    `contactDetails` JSON NULL,
    `referrerType` VARCHAR(191) NULL,
    `dateJoined` DATETIME(3) NULL,
    `commissionType` VARCHAR(191) NULL,
    `commissionAmount` DECIMAL(12, 2) NULL,
    `paymentTerms` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `brokers_tenantId_name_idx`(`tenantId`, `name`),
    UNIQUE INDEX `brokers_tenantId_brokerCode_key`(`tenantId`, `brokerCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `nationalIdPassport` VARCHAR(191) NULL,
    `county` VARCHAR(191) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `highestEducation` VARCHAR(191) NULL,
    `languages` JSON NULL,
    `relevantSkills` VARCHAR(191) NULL,
    `profilePhotoUrl` VARCHAR(191) NULL,
    `passportCopyUrl` VARCHAR(191) NULL,
    `idCopyUrl` VARCHAR(191) NULL,
    `supportingCertificates` JSON NULL,
    `previousEmployer` VARCHAR(191) NULL,
    `previousRole` VARCHAR(191) NULL,
    `previousDuration` VARCHAR(191) NULL,
    `referenceContact` JSON NULL,
    `applyingViaAgent` BOOLEAN NOT NULL DEFAULT false,
    `agentId` INTEGER NULL,
    `referredByBroker` BOOLEAN NOT NULL DEFAULT false,
    `brokerId` INTEGER NULL,
    `feeAgreementConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `medicalClearanceUrl` VARCHAR(191) NULL,
    `policeClearanceUrl` VARCHAR(191) NULL,
    `languageTestScore` DOUBLE NULL,
    `interviewStatus` VARCHAR(191) NULL,
    `preferredCountry` VARCHAR(191) NULL,
    `jobTypePreference` VARCHAR(191) NULL,
    `willingToRelocate` BOOLEAN NOT NULL DEFAULT false,
    `declarationConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('APPLIED', 'UNDER_REVIEW', 'ENROLLED', 'WAITLISTED', 'CANCELLED', 'PLACED') NOT NULL DEFAULT 'APPLIED',
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidates_userId_key`(`userId`),
    INDEX `candidates_tenantId_status_idx`(`tenantId`, `status`),
    INDEX `candidates_tenantId_fullName_idx`(`tenantId`, `fullName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `uploadedBy` INTEGER NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `candidate_documents_tenantId_documentType_idx`(`tenantId`, `documentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `durationDays` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `trainers` JSON NULL,
    `capacity` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `courses_tenantId_title_idx`(`tenantId`, `title`),
    UNIQUE INDEX `courses_tenantId_code_key`(`tenantId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `applicationId` INTEGER NULL,
    `enrollmentDate` DATETIME(3) NULL,
    `enrollmentStatus` ENUM('APPLIED', 'ENROLLED', 'WAITLISTED', 'REJECTED', 'COMPLETED', 'WITHDRAWN') NOT NULL DEFAULT 'APPLIED',
    `paymentStatus` ENUM('PAID', 'PENDING', 'EXEMPT', 'OVERDUE') NULL DEFAULT 'PENDING',
    `agentId` INTEGER NULL,
    `admissionStatus` VARCHAR(191) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `enrollments_tenantId_enrollmentStatus_idx`(`tenantId`, `enrollmentStatus`),
    UNIQUE INDEX `enrollments_tenantId_courseId_candidateId_key`(`tenantId`, `courseId`, `candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `enrollmentId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `sessionNumber` INTEGER NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED') NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `recordedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `attendance_records_tenantId_courseId_date_idx`(`tenantId`, `courseId`, `date`),
    UNIQUE INDEX `attendance_records_tenantId_enrollmentId_date_key`(`tenantId`, `enrollmentId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `enrollmentId` INTEGER NOT NULL,
    `assessmentType` VARCHAR(191) NOT NULL,
    `score` DOUBLE NULL,
    `resultCategory` ENUM('PASS', 'FAIL', 'INCOMPLETE') NULL,
    `trainerComments` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `assessments_tenantId_courseId_idx`(`tenantId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `enrollmentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `certificateNo` VARCHAR(191) NOT NULL,
    `traineeName` VARCHAR(191) NOT NULL,
    `courseTitle` VARCHAR(191) NOT NULL,
    `completionDate` DATETIME(3) NULL,
    `trainerName` VARCHAR(191) NULL,
    `signatureData` JSON NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `verificationCode` VARCHAR(191) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `certificates_certificateNo_key`(`certificateNo`),
    UNIQUE INDEX `certificates_verificationCode_key`(`verificationCode`),
    INDEX `certificates_tenantId_traineeName_idx`(`tenantId`, `traineeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vetting_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `policeClearanceNo` VARCHAR(191) NULL,
    `policeDocumentUrl` VARCHAR(191) NULL,
    `medicalReportNo` VARCHAR(191) NULL,
    `medicalReportUrl` VARCHAR(191) NULL,
    `medicalStatus` VARCHAR(191) NULL,
    `vaccinationProofUrl` VARCHAR(191) NULL,
    `languageTestPassed` BOOLEAN NULL,
    `interviewReadinessChecklist` JSON NULL,
    `verificationOfficerId` INTEGER NULL,
    `vettingStatus` ENUM('PENDING', 'IN_PROGRESS', 'CLEARED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewedBy` INTEGER NULL,
    `reviewDate` DATETIME(3) NULL,
    `comments` VARCHAR(191) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `vetting_records_tenantId_vettingStatus_idx`(`tenantId`, `vettingStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `placements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `candidateId` INTEGER NOT NULL,
    `agentId` INTEGER NULL,
    `brokerId` INTEGER NULL,
    `recruitingAgency` VARCHAR(191) NULL,
    `jobRoleOffered` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `employerName` VARCHAR(191) NULL,
    `interviewDate` DATETIME(3) NULL,
    `interviewResult` VARCHAR(191) NULL,
    `offerLetterUrl` VARCHAR(191) NULL,
    `visaApplicationNo` VARCHAR(191) NULL,
    `visaStatus` VARCHAR(191) NULL,
    `travelDate` DATETIME(3) NULL,
    `flightDetails` JSON NULL,
    `recruitmentOfficerId` INTEGER NULL,
    `trainingFeeBalance` DECIMAL(12, 2) NULL,
    `agentCommission` DECIMAL(12, 2) NULL,
    `brokerFee` DECIMAL(12, 2) NULL,
    `contractUploaded` BOOLEAN NOT NULL DEFAULT false,
    `paymentConfirmation` BOOLEAN NOT NULL DEFAULT false,
    `candidateNotified` BOOLEAN NOT NULL DEFAULT false,
    `acceptanceConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `placementStatus` ENUM('INITIATED', 'INTERVIEW_SCHEDULED', 'OFFER_LETTER_SENT', 'VISA_PROCESSING', 'TRAVEL_READY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'INITIATED',
    `placementCompletedDate` DATETIME(3) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `placements_tenantId_placementStatus_idx`(`tenantId`, `placementStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `referenceNo` VARCHAR(191) NOT NULL,
    `payerId` INTEGER NULL,
    `type` ENUM('TRAINING_FEE', 'COMMISSION', 'BROKER_FEE', 'OTHER') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(191) NULL DEFAULT 'KES',
    `method` ENUM('MPESA', 'FLUTTERWAVE', 'BANK_TRANSFER', 'CASH', 'OTHER') NULL,
    `status` ENUM('PAID', 'PENDING', 'EXEMPT', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `metadata` JSON NULL,
    `invoicePdfUrl` VARCHAR(191) NULL,
    `agentId` INTEGER NULL,
    `brokerId` INTEGER NULL,
    `candidateId` INTEGER NULL,
    `placementId` INTEGER NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payments_tenantId_status_idx`(`tenantId`, `status`),
    UNIQUE INDEX `payments_tenantId_referenceNo_key`(`tenantId`, `referenceNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `referenceNo` VARCHAR(191) NOT NULL,
    `payerName` VARCHAR(191) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(191) NULL DEFAULT 'KES',
    `status` ENUM('PAID', 'PENDING', 'EXEMPT', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `dueDate` DATETIME(3) NULL,
    `issuedDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoices_referenceNo_key`(`referenceNo`),
    INDEX `invoices_tenantId_status_idx`(`tenantId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `channel` ENUM('EMAIL', 'SMS', 'WHATSAPP', 'IN_APP') NOT NULL,
    `templateKey` VARCHAR(191) NOT NULL,
    `payload` JSON NULL,
    `status` ENUM('QUEUED', 'SENT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'QUEUED',
    `sentAt` DATETIME(3) NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `notifications_tenantId_status_idx`(`tenantId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `settings_tenantId_key_key`(`tenantId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `activity_logs_tenantId_module_idx` ON `activity_logs`(`tenantId`, `module`);

-- CreateIndex
CREATE UNIQUE INDEX `roles_tenantId_name_key` ON `roles`(`tenantId`, `name`);
