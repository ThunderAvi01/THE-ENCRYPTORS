import mongoose, { Schema, Document, Model } from "mongoose";
import { AyushSystem, DoctorProfileStatus, ChamberInformation, DayAvailability } from "@/types/user";

export interface IDoctorProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  registrationNumber: string;
  ayushSystem: AyushSystem;
  specialization: string;
  qualifications: string[];
  consultationFee: number;
  chamberInformation: ChamberInformation;
  availability: DayAvailability[];
  profileStatus: DoctorProfileStatus;
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChamberSchema = new Schema<ChamberInformation>(
  {
    clinicName: { type: String, default: "Clinical Chamber" },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    contactNumber: { type: String },
  },
  { _id: false }
);

const TimeSlotSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const DayAvailabilitySchema = new Schema<DayAvailability>(
  {
    day: {
      type: String,
      enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    timeSlots: [TimeSlotSchema],
  },
  { _id: false }
);

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: [true, "Medical registration number is required"],
      trim: true,
      index: true,
    },
    ayushSystem: {
      type: String,
      enum: ["ALLOPATHY", "AYURVEDA", "YOGA_NATUROPATHY", "UNANI", "SIDDHA", "HOMEOPATHY"],
      default: "ALLOPATHY",
      required: true,
      index: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    consultationFee: {
      type: Number,
      default: 500,
      min: 0,
    },
    chamberInformation: {
      type: ChamberSchema,
      default: () => ({
        clinicName: "General Medical OPD",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      }),
    },
    availability: {
      type: [DayAvailabilitySchema],
      default: [
        { day: "MONDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
        { day: "TUESDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
        { day: "WEDNESDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
        { day: "THURSDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
        { day: "FRIDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
        { day: "SATURDAY", isAvailable: true, timeSlots: [{ start: "09:00", end: "13:00" }] },
        { day: "SUNDAY", isAvailable: false, timeSlots: [] },
      ],
    },
    profileStatus: {
      type: String,
      enum: ["PENDING_VERIFICATION", "VERIFIED", "REJECTED", "SUSPENDED"],
      default: "PENDING_VERIFICATION",
      index: true,
    },
    verificationNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const DoctorProfile: Model<IDoctorProfile> =
  mongoose.models.DoctorProfile ||
  mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);
