import mongoose, { Schema, Document, Model } from "mongoose";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "URGENT";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  caseRecordId?: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM" or "10:00"
  scheduledAt?: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  consultationType: "TELEHEALTH" | "IN_PERSON";
  consultationFee: number;
  chamberLocation?: string;
  meetingLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caseRecordId: { type: Schema.Types.ObjectId, ref: "CaseRecord" },
    date: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    scheduledAt: { type: Date },
    durationMinutes: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW", "URGENT"],
      default: "PENDING",
      required: true,
      index: true,
    },
    consultationType: {
      type: String,
      enum: ["TELEHEALTH", "IN_PERSON"],
      default: "IN_PERSON",
    },
    consultationFee: { type: Number, default: 500 },
    chamberLocation: { type: String },
    meetingLink: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent double booking for same doctor at same date and time slot
AppointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: false });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
