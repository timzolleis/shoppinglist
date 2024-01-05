-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultListId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultListId_fkey" FOREIGN KEY ("defaultListId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
