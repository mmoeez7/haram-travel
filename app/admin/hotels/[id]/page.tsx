import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { HotelFormClient } from "@/components/admin/HotelFormClient";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const hotel = await prisma.hotel.findFirst({ where: { id, deletedAt: null } });
  if (!hotel) notFound();
  return <HotelFormClient hotel={hotel} />;
}
