import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctorReview extends Document {
  appointmentId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorReviewSchema = new Schema<IDoctorReview>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
      index: true,
    },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const DoctorReview: Model<IDoctorReview> =
  mongoose.models.DoctorReview || mongoose.model<IDoctorReview>("DoctorReview", DoctorReviewSchema);
