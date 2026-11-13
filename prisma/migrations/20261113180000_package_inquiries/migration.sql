-- CreateTable
CREATE TABLE "package_inquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "hotel_tier" TEXT NOT NULL,
    "passengers" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'HOME_MATCHER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "package_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "package_inquiries_status_created_at_idx" ON "package_inquiries"("status", "created_at");

-- CreateIndex
CREATE INDEX "package_inquiries_email_idx" ON "package_inquiries"("email");
