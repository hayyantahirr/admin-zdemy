import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db.js";
import Gallery from "../../../../../lib/models/Gallery.js";

// DELETE - Delete gallery item
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return NextResponse.json(
        { message: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting gallery", error: error.message },
      { status: 500 }
    );
  }
}