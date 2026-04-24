-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecipeTagToTip" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeTagToTip_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tip_slug_key" ON "Tip"("slug");

-- CreateIndex
CREATE INDEX "_RecipeTagToTip_B_index" ON "_RecipeTagToTip"("B");

-- AddForeignKey
ALTER TABLE "_RecipeTagToTip" ADD CONSTRAINT "_RecipeTagToTip_A_fkey" FOREIGN KEY ("A") REFERENCES "RecipeTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeTagToTip" ADD CONSTRAINT "_RecipeTagToTip_B_fkey" FOREIGN KEY ("B") REFERENCES "Tip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
