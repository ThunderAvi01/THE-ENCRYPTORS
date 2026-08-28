import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatMessage extends Document {
  conversationId: string; // e.g. "chat_<patientId>_<doctorId>"
  senderId: mongoose.Types.ObjectId;
  senderRole: "PATIENT" | "DOCTOR";
  recipientId: mongoose.Types.ObjectId;
  text: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    senderRole: { type: String, enum: ["PATIENT", "DOCTOR"], required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, default: "" },
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, default: "DOCUMENT" },
      },
    ],
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
