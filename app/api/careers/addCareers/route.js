import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db.js";
import Careers from "../../../../lib/models/Careers.js";

// POST - Add career
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    await Careers.create(data);
    return NextResponse.json({ message: "Careers added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding careers", error: error.message },
      { status: 500 }
    );
  }
}