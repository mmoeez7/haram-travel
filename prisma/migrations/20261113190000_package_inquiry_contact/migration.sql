-- AlterTable
ALTER TABLE "package_inquiries" ALTER COLUMN "season" DROP NOT NULL;
ALTER TABLE "package_inquiries" ALTER COLUMN "departure" DROP NOT NULL;
ALTER TABLE "package_inquiries" ALTER COLUMN "nights" DROP NOT NULL;
ALTER TABLE "package_inquiries" ALTER COLUMN "hotel_tier" DROP NOT NULL;
ALTER TABLE "package_inquiries" ALTER COLUMN "passengers" DROP NOT NULL;

-- AlterTable
ALTER TABLE "package_inquiries" ADD COLUMN "message" TEXT;

-- CreateIndex
CREATE INDEX "package_inquiries_source_created_at_idx" ON "package_inquiries"("source", "created_at");
