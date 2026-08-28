import mongoose, { Schema, Document, Model } from "mongoose";
import { EmergencyContact, PatientLocation } from "@/types/user";

export interface IPatientProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  preferredLanguage: string;
  location?: PatientLocation;
  emergencyContact?: EmergencyContact;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  abhaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyContactSchema = new Schema<EmergencyContact>(
  {
    name: { type: String, default: "" },
    relationship: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const LocationSchema = new Schema<PatientLocation>(
  {
    address: { type: String },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false }
);

const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    dateOfBirth: { type: String },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
    },
    preferredLanguage: { type: String, default: "en" },
    location: { type: LocationSchema },
    emergencyContact: { type: EmergencyContactSchema },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    abhaId: { type: String, sparse: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const PatientProfile: Model<IPatientProfile> =
  mongoose.models.PatientProfile ||
  mongoose.model<IPatientProfile>("PatientProfile", PatientProfileSchema);
