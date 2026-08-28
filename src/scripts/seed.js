/**
 * Seed script for Phase 1 Authentication & RBAC testing
 * Run with: node src/scripts/seed.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Read .env.local or .env
let envContent = "";
try {
  envContent = fs.readFileSync(path.join(__dirname, "../../.env.local"), "utf8");
} catch {
  envContent = fs.readFileSync(path.join(__dirname, "../../.env"), "utf8");
}

let mongoUri = "mongodb://localhost:27017/sih_patient_case_taking";
const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
if (uriMatch) {
  mongoUri = uriMatch[1].trim();
}

async function seed() {
  console.log("Connecting to database...");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB successfully.");

  const db = mongoose.connection.db;
  const usersCollection = db.collection("users");
  const doctorProfilesCollection = db.collection("doctorprofiles");
  const patientProfilesCollection = db.collection("patientprofiles");

  const passwordHash = await bcrypt.hash("Password123", 12);

  // 1. Patient User
  const patientUser = {
    name: "Avishek Patient",
    email: "patient@example.com",
    passwordHash,
    role: "PATIENT",
    phone: "9876543210",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 2. Doctor User (Allopathy)
  const doctorUser = {
    name: "Dr. Priya Sharma",
    email: "doctor@example.com",
    passwordHash,
    role: "DOCTOR",
    phone: "9812345678",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 3. Admin User
  const adminUser = {
    name: "Chief Medical Administrator",
    email: "admin@example.com",
    passwordHash,
    role: "ADMIN",
    phone: "9800000001",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 4. Triage Staff User
  const triageUser = {
    name: "OPD Triage Staff",
    email: "triage@example.com",
    passwordHash,
    role: "TRIAGE_STAFF",
    phone: "9800000002",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const seedUsers = [patientUser, doctorUser, adminUser, triageUser];

  for (const u of seedUsers) {
    const existing = await usersCollection.findOne({ email: u.email });
    let userId;
    if (existing) {
      console.log(`User ${u.email} already exists (Role: ${existing.role}).`);
      userId = existing._id;
    } else {
      const res = await usersCollection.insertOne(u);
      userId = res.insertedId;
      console.log(`Created user: ${u.email} (Role: ${u.role})`);
    }

    if (u.role === "DOCTOR") {
      const existingDoc = await doctorProfilesCollection.findOne({ userId });
      if (!existingDoc) {
        await doctorProfilesCollection.insertOne({
          userId,
          registrationNumber: "NMC-2024-99881",
          ayushSystem: "ALLOPATHY",
          specialization: "General Medicine & Clinical Triage",
          qualifications: ["MBBS (AIIMS)", "MD (Internal Medicine)"],
          consultationFee: 600,
          chamberInformation: {
            clinicName: "Apollo Multispecialty OPD",
            addressLine1: "Room 104, Clinical Block",
            city: "New Delhi",
            state: "Delhi",
            pincode: "110001",
          },
          profileStatus: "VERIFIED",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Created doctor profile for ${u.email}`);
      }
    } else if (u.role === "PATIENT") {
      const existingPat = await patientProfilesCollection.findOne({ userId });
      if (!existingPat) {
        await patientProfilesCollection.insertOne({
          userId,
          dateOfBirth: "1994-06-15",
          gender: "MALE",
          preferredLanguage: "en",
          bloodGroup: "O+",
          abhaId: "91-8821-4920-11",
          location: {
            city: "Kolkata",
            state: "West Bengal",
            pincode: "700001",
          },
          emergencyContact: {
            name: "Rajesh Modak",
            relationship: "Brother",
            phone: "9876500000",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Created patient profile for ${u.email}`);
      }
    }
  }

  console.log("\n==========================================");
  console.log("SEEDING COMPLETED SUCCESSFULLY!");
  console.log("Test Accounts (Password for all: Password123):");
  console.log("1. Patient:      patient@example.com      -> /patient/dashboard");
  console.log("2. Doctor:       doctor@example.com       -> /doctor/dashboard");
  console.log("3. Admin:        admin@example.com        -> /admin/dashboard");
  console.log("4. Triage Staff: triage@example.com       -> /triage/dashboard");
  console.log("==========================================\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
