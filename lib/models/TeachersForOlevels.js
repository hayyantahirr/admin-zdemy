import mongoose from "mongoose";

const { Schema } = mongoose;

const teachersForOlevelsSchema = new Schema({
  name: String,
  image: String,
  description: String,
  aGrade: Number,
  aStar: Number,
  facebook: String,
  website: String,
  instagram: String,
  subjects: [String],
  experience: Number,
  schedule: [
    {
      day: {
        type: String, // e.g. "Monday", "Tuesday"
        required: true,
      },
      startTime: {
        type: String, // e.g. "20:00" (8 PM in 24h format)
        required: true,
      },
      endTime: {
        type: String, // e.g. "22:00" (10 PM)
        required: true,
      },
    },
  ],
});

const TeachersForOlevels =
  mongoose.models.TeachersForOlevels ||
  mongoose.model(
    "TeachersForOlevels",
    teachersForOlevelsSchema,
    "teachersForOlevels"
  );

export default TeachersForOlevels;
