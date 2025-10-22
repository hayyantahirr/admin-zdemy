import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db.js";
import TeachersForOlevels from "../../../../../lib/models/TeachersForOlevels.js";

// DELETE - Delete teacher
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedTeacher = await TeachersForOlevels.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting teacher", error: error.message },
      { status: 500 }
    );
  }
}