"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Stethoscope,
  Building2,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole, AyushSystem } from "@/types/user";
import { registerSchema, ayushSystems } from "@/lib/validations/auth";

export function RegisterCard() {
  const router = useRouter();

  // Form State
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  // Patient Specific
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY">("PREFER_NOT_TO_SAY");
  const [bloodGroup, setBloodGroup] = useState("");
  const [abhaId, setAbhaId] = useState("");

  // Doctor Specific
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [ayushSystem, setAyushSystem] = useState<AyushSystem>("ALLOPATHY");
  const [specialization, setSpecialization] = useState("General Medicine");
  const [consultationFee, setConsultationFee] = useState("500");
  const [chamberClinicName, setChamberClinicName] = useState("");
  const [chamberCity, setChamberCity] = useState("");
  const [chamberState, setChamberState] = useState("");
  const [chamberPincode, setChamberPincode] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // Prepare payload
    const payload: Record<string, unknown> = {
      name,
      email,
      password,
      phone: phone || undefined,
      role,
    };

    if (role === "PATIENT") {
      if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
      if (gender) payload.gender = gender;
      if (bloodGroup) payload.bloodGroup = bloodGroup;
      if (abhaId) payload.abhaId = abhaId;
    } else if (role === "DOCTOR") {
      payload.registrationNumber = registrationNumber;
      payload.ayushSystem = ayushSystem;
      payload.specialization = specialization;
      payload.consultationFee = Number(consultationFee) || 0;
      if (chamberClinicName) payload.chamberClinicName = chamberClinicName;
      if (chamberCity) payload.chamberCity = chamberCity;
      if (chamberState) payload.chamberState = chamberState;
      if (chamberPincode) payload.chamberPincode = chamberPincode;
    }

    // Client-side Zod validation
    const validation = registerSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const formatted: Record<string, string> = {};
          Object.keys(data.details).forEach((k) => {
            formatted[k] = data.details[k][0];
          });
          setFieldErrors(formatted);
        }
        setErrorMessage(data.error || "Registration failed. Please review your inputs.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    } catch (err) {
      console.error("Register request error:", err);
      setErrorMessage("Network error occurred. Please check connection.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl w-full border-border shadow-xl">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 mb-1">
          <UserPlus className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">Create an Account</CardTitle>
        <CardDescription className="text-xs">
          Register as a Patient for case intake or as a Doctor for clinical verification
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Role Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Your Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole("PATIENT");
                  setFieldErrors({});
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition ${
                  role === "PATIENT"
                    ? "border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100 font-bold ring-2 ring-teal-500"
                    : "border-border bg-card text-muted-foreground hover:border-border/80"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-xs">Patient Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("DOCTOR");
                  setFieldErrors({});
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition ${
                  role === "DOCTOR"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500"
                    : "border-border bg-card text-muted-foreground hover:border-border/80"
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                <span className="text-xs">Doctor / Clinician</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Common Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex justify-between">
                <span>Full Name *</span>
                {fieldErrors.name && <span className="text-[10px] text-rose-500">{fieldErrors.name}</span>}
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g. Dr. Priya Sharma / Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="pl-9 text-xs"
                />
                <User className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex justify-between">
                <span>Email Address *</span>
                {fieldErrors.email && <span className="text-[10px] text-rose-500">{fieldErrors.email}</span>}
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-9 text-xs"
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex justify-between">
                <span>Password * (Min 8 chars, A-Z, 0-9)</span>
                {fieldErrors.password && <span className="text-[10px] text-rose-500">{fieldErrors.password}</span>}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-9 pr-9 text-xs"
                />
                <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex justify-between">
                <span>Mobile Number</span>
                {fieldErrors.phone && <span className="text-[10px] text-rose-500">{fieldErrors.phone}</span>}
              </label>
              <div className="relative">
                <Input
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="pl-9 text-xs"
                />
                <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* DOCTOR SPECIFIC FIELDS */}
          {role === "DOCTOR" && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-200">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                <span>Doctor Verification & AYUSH Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground flex justify-between">
                    <span>NMC / AYUSH Council Reg. Number *</span>
                    {fieldErrors.registrationNumber && (
                      <span className="text-[10px] text-rose-500">{fieldErrors.registrationNumber}</span>
                    )}
                  </label>
                  <Input
                    placeholder="e.g. MCI-2024-88910"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Medical / AYUSH System *</label>
                  <select
                    value={ayushSystem}
                    onChange={(e) => setAyushSystem(e.target.value as AyushSystem)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="ALLOPATHY">Allopathy (Modern Medicine - MBBS/MD)</option>
                    <option value="AYURVEDA">Ayurveda (BAMS/MD Ayur)</option>
                    <option value="HOMEOPATHY">Homeopathy (BHMS/MD Hom)</option>
                    <option value="UNANI">Unani Medicine (BUMS)</option>
                    <option value="SIDDHA">Siddha (BSMS)</option>
                    <option value="YOGA_NATUROPATHY">Yoga & Naturopathy (BNYS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground flex justify-between">
                    <span>Clinical Specialization *</span>
                    {fieldErrors.specialization && (
                      <span className="text-[10px] text-rose-500">{fieldErrors.specialization}</span>
                    )}
                  </label>
                  <Input
                    placeholder="e.g. General Medicine / Kayachikitsa"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Consultation Fee (₹)</label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <Input
                  placeholder="Clinic / Hospital Chamber"
                  value={chamberClinicName}
                  onChange={(e) => setChamberClinicName(e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="City (e.g. New Delhi)"
                  value={chamberCity}
                  onChange={(e) => setChamberCity(e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="Pincode"
                  value={chamberPincode}
                  onChange={(e) => setChamberPincode(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {/* PATIENT SPECIFIC FIELDS */}
          {role === "PATIENT" && (
            <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200">
                <User className="h-4 w-4 text-teal-600" />
                <span>Patient Health Profile Details (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Date of Birth</label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="PREFER_NOT_TO_SAY">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Unknown / Optional</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">
                  ABHA ID (Ayushman Bharat Health Account - Optional)
                </label>
                <Input
                  placeholder="e.g. 91-8821-4920-11"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant={role === "DOCTOR" ? "doctor" : "clinical"}
            className="w-full gap-2 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete {role === "DOCTOR" ? "Doctor" : "Patient"} Registration</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-teal-600 hover:underline">
              Sign in to your account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
