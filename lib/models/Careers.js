import mongoose from "mongoose";

const { Schema } = mongoose;

const careersSchema = new Schema({
  fullName: String,
  email: String,
  phone: Number,
  phone2: Number,
  address: String,
  position: String,
});

const Careers =
  mongoose.models.Careers ||
  mongoose.model("Careers", careersSchema, "careers");

export default Careers;
