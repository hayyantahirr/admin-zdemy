import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import Careers from "../../../lib/models/Careers.js";

// GET all careers
export async function GET() {
  try {
    await connectDB();
    const data = await Careers.find();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching careers", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add career (for addCareers endpoint)
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