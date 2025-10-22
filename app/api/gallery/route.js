import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import Gallery from "../../../lib/models/Gallery.js";

// GET all gallery items
export async function GET() {
  try {
    await connectDB();
    const data = await Gallery.find();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching gallery", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add gallery item (for addGallery endpoint)
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
