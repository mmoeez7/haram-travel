-- CreateTable
CREATE TABLE "text_reviews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initial" VARCHAR(2) NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "text_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "text_reviews_published_sort_order_idx" ON "text_reviews"("published", "sort_order");

-- CreateIndex
CREATE INDEX "text_reviews_deleted_at_sort_order_idx" ON "text_reviews"("deleted_at", "sort_order");
