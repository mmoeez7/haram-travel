-- AlterTable
ALTER TABLE "categories" ADD COLUMN "parent_id" TEXT;

-- CreateIndex
CREATE INDEX "categories_parent_id_published_sort_order_idx" ON "categories"("parent_id", "published", "sort_order");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
