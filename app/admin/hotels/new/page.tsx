import { requireAdmin } from "@/lib/admin";
import { HotelFormClient } from "@/components/admin/HotelFormClient";

export default async function NewHotelPage() {
  await requireAdmin();
  return <HotelFormClient />;
}
