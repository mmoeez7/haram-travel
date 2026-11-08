-- CreateTable
CREATE TABLE "video_reviews" (
    "id" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Customer Umrah Experience',
    "description" TEXT NOT NULL,
    "cta" TEXT NOT NULL DEFAULT 'Watch Story',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "video_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_reviews_published_sort_order_idx" ON "video_reviews"("published", "sort_order");

-- CreateIndex
CREATE INDEX "video_reviews_deleted_at_sort_order_idx" ON "video_reviews"("deleted_at", "sort_order");
