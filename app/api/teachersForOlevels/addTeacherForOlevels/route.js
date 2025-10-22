import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import TeachersForOlevels from "../../../../lib/models/TeachersForOlevels.js";

// POST - Add teacher
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    await TeachersForOlevels.create(data);
    return NextResponse.json({ message: "Teacher added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding teacher", error: error.message },
      { status: 500 }
    );
  }
}