import { NextResponse } from "next/server";
import { getPublishedHotelById } from "@/lib/hotels";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const hotel = await getPublishedHotelById(id);
  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }
  return NextResponse.json({ hotel });
}
