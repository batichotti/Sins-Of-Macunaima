/*
  Warnings:

  - You are about to drop the column `nick` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "nick",
ADD COLUMN     "best_run" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL;
