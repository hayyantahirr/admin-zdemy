import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db.js";
import TeachersForOlevels from "../../../../../lib/models/TeachersForOlevels.js";

// PUT - Update teacher
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updateData = await request.json();

    const updatedTeacher = await TeachersForOlevels.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // returns the updated document
    );

    if (!updatedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Teacher updated successfully", 
      updatedTeacher 
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating teacher", error: error.message },
      { status: 500 }
    );
  }
}