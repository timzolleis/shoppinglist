/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `color` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "backgroundColor",
DROP
COLUMN "textColor",
ADD COLUMN     "color" TEXT NOT NULL;
