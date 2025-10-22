import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db.js";
import Careers from "../../../../../lib/models/Careers.js";

// DELETE - Delete career
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedCareers = await Careers.findByIdAndDelete(id);

    if (!deletedCareers) {
      return NextResponse.json(
        { message: "Careers not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Careers deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting careers", error: error.message },
      { status: 500 }
    );
  }
}