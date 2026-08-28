import { z } from "zod";

export const aiQuestionResponseSchema = z.object({
  nextQuestion: z.string().min(1, "Next question string cannot be empty"),
  category: z.enum([
    "language_consent",
    "ayush_selection",
    "chief_complaint",
    "hpi",
    "past_history",
    "medications_allergies",
    "lifestyle_ros",
    "ayurveda_dashavidha",
    "review",
  ]),
  reason: z.string().default("Follow-up based on patient history"),
  collectedInformation: z.record(z.unknown()).default({}),
  missingFields: z.array(z.string()).default([]),
  possibleRedFlags: z.array(z.string()).default([]),
});

export type AIQuestionResponseZod = z.infer<typeof aiQuestionResponseSchema>;
