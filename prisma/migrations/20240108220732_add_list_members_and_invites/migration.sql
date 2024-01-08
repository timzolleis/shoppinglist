-- CreateTable
CREATE TABLE "ListInvite"
(
    "id"        TEXT NOT NULL,
    "listId"    TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "userId"    TEXT,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "ListInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_listMember"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_listMember_AB_unique" ON "_listMember" ("A", "B");

-- CreateIndex
CREATE INDEX "_listMember_B_index" ON "_listMember" ("B");

-- AddForeignKey
ALTER TABLE "ListInvite"
    ADD CONSTRAINT "ListInvite_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListInvite"
    ADD CONSTRAINT "ListInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_listMember"
    ADD CONSTRAINT "_listMember_A_fkey" FOREIGN KEY ("A") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_listMember"
    ADD CONSTRAINT "_listMember_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
