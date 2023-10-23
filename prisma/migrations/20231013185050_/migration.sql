/*
  Warnings:

  - A unique constraint covering the columns `[sender_id,recipient_id,contract_post_id]` on the table `like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contract_post_id` to the `like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `like` ADD COLUMN `contract_post_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `like_sender_id_recipient_id_contract_post_id_key` ON `like`(`sender_id`, `recipient_id`, `contract_post_id`);
