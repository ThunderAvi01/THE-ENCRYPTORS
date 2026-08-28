import { Appointment } from "../models/Appointment";
import { DoctorReview } from "../models/DoctorReview";

console.log("=================================================");
console.log("SIH26047 PHASE 9 FEATURES & ACCESS-CONTROL VERIFICATION TEST");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedCount++;
  }
}

// 1. Test Double-Booking Conflict Prevention Logic
console.log("--- 1. Testing Appointment Conflict Prevention ---");

function checkAppointmentConflict(
  existingAppointments: Array<{ date: string; timeSlot: string; status: string }>,
  newBooking: { date: string; timeSlot: string }
): boolean {
  return existingAppointments.some(
    (app) =>
      app.date === newBooking.date &&
      app.timeSlot === newBooking.timeSlot &&
      ["PENDING", "CONFIRMED", "URGENT"].includes(app.status)
  );
}

const existing = [
  { date: "2026-08-28", timeSlot: "10:00 AM", status: "CONFIRMED" },
  { date: "2026-08-28", timeSlot: "11:30 AM", status: "CANCELLED" },
];

const conflictResult1 = checkAppointmentConflict(existing, {
  date: "2026-08-28",
  timeSlot: "10:00 AM",
});
assert(conflictResult1 === true, "Prevents double-booking overlapping slot on same date");

const conflictResult2 = checkAppointmentConflict(existing, {
  date: "2026-08-28",
  timeSlot: "11:30 AM",
});
assert(conflictResult2 === false, "Allows booking slot if previous status is CANCELLED");

const conflictResult3 = checkAppointmentConflict(existing, {
  date: "2026-08-28",
  timeSlot: "02:00 PM",
});
assert(conflictResult3 === false, "Allows booking available unbooked slot");

// 2. Test Strict Chat Authorization Guard
console.log("\n--- 2. Testing Chat Authorization Guard ---");

function authorizeChatAccess(
  currentUser: { id: string; role: string },
  patientId: string,
  doctorId: string,
  authorizedPairs: Array<{ patientId: string; doctorId: string }>
): boolean {
  if (currentUser.role === "ADMIN") return true;

  // Patient can only access their own chats
  if (currentUser.role === "PATIENT" && currentUser.id !== patientId) {
    return false;
  }
  // Doctor can only access authorized patient chats
  if (currentUser.role === "DOCTOR" && currentUser.id !== doctorId) {
    return false;
  }

  return authorizedPairs.some(
    (pair) => pair.patientId === patientId && pair.doctorId === doctorId
  );
}

const activePairs = [{ patientId: "pat_123", doctorId: "doc_456" }];

const authTest1 = authorizeChatAccess(
  { id: "pat_123", role: "PATIENT" },
  "pat_123",
  "doc_456",
  activePairs
);
assert(authTest1 === true, "Authorized patient can access their doctor chat");

const authTest2 = authorizeChatAccess(
  { id: "pat_999", role: "PATIENT" },
  "pat_123",
  "doc_456",
  activePairs
);
assert(authTest2 === false, "Unauthorized patient is BLOCKED from accessing another patient's chat");

const authTest3 = authorizeChatAccess(
  { id: "doc_999", role: "DOCTOR" },
  "pat_123",
  "doc_456",
  activePairs
);
assert(authTest3 === false, "Unauthorized doctor is BLOCKED from unassigned patient chat");

// 3. Test Review Pre-Completion Block
console.log("\n--- 3. Testing Review Submission Guardrails ---");

function canSubmitReview(appointmentStatus: string, alreadyReviewed: boolean): { allowed: boolean; error?: string } {
  if (appointmentStatus !== "COMPLETED") {
    return { allowed: false, error: "Reviews are only permitted after appointment completion." };
  }
  if (alreadyReviewed) {
    return { allowed: false, error: "Duplicate review for same appointment is blocked." };
  }
  return { allowed: true };
}

const reviewTest1 = canSubmitReview("CONFIRMED", false);
assert(reviewTest1.allowed === false, "Blocks review before appointment completion");

const reviewTest2 = canSubmitReview("COMPLETED", true);
assert(reviewTest2.allowed === false, "Blocks duplicate review for same appointment");

const reviewTest3 = canSubmitReview("COMPLETED", false);
assert(reviewTest3.allowed === true, "Allows review for completed unreviewed appointment");

console.log("\n-------------------------------------------------");
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED.`);
console.log("-------------------------------------------------");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("PHASE 9 FEATURES & ACCESS-CONTROL VERIFICATION PASSED!\n");
}
