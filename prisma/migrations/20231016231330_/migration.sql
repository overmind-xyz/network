/*
  Warnings:

  - You are about to drop the column `is_claimed` on the `spin` table. All the data in the column will be lost.
  - You are about to drop the column `is_redeemed` on the `spin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `spin` DROP COLUMN `is_claimed`,
    DROP COLUMN `is_redeemed`,
    ADD COLUMN `has_spun` BOOLEAN NOT NULL DEFAULT false;
