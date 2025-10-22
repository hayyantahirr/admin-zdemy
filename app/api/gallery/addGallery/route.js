import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import Gallery from "../../../../lib/models/Gallery.js";

// POST - Add gallery item
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    await Gallery.create(data);
    return NextResponse.json({ message: "Gallery added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding gallery", error: error.message },
      { status: 500 }
    );
  }
}
