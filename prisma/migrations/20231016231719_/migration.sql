/*
  Warnings:

  - You are about to drop the column `claimed_at` on the `spin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `spin` DROP COLUMN `claimed_at`,
    ADD COLUMN `spun_at` DATETIME(3) NULL;
