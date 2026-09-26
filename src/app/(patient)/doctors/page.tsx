"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Stethoscope,
  Calendar,
  Clock,
  Star,
  Globe,
  Filter,
  CheckCircle2,
  ChevronLeft,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { DoctorChamberMap } from "@/components/maps/DoctorChamberMap";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface DoctorSearchResult {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  registrationNumber: string;
  ayushSystem: string;
  specialization: string;
  consultationFee: number;
  chamberInformation: {
    clinicName?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    contactNumber?: string;
  };
  availability?: Array<{
    day: string;
    isAvailable: boolean;
    timeSlots: Array<{ start: string; end: string }>;
  }>;
}

export default function DoctorDiscoveryPage() {
  const { dict } = useLanguage();
  const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAyush, setSelectedAyush] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");

  // Booking Modal State
  const [selectedDocForBooking, setSelectedDocForBooking] = useState<DoctorSearchResult | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-08-28");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("10:00 AM");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);
  const [bookingErrMsg, setBookingErrMsg] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedAyush !== "ALL") params.append("ayushSystem", selectedAyush);
      if (selectedLocation) params.append("location", selectedLocation);
      if (selectedSpec) params.append("specialization", selectedSpec);
      if (searchQuery) params.append("query", searchQuery);

      const res = await fetch(`/api/doctor/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedAyush, selectedLocation, selectedSpec]);

  const handleBookAppointment = async () => {
    if (!selectedDocForBooking) return;
    setIsBooking(true);
    setBookingSuccessMsg(null);
    setBookingErrMsg(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDocForBooking.userId._id,
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          consultationType: "IN_PERSON",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingSuccessMsg(`Appointment booked successfully for ${bookingDate} at ${bookingTimeSlot}!`);
        setTimeout(() => {
          setSelectedDocForBooking(null);
          setBookingSuccessMsg(null);
        }, 3000);
      } else {
        setBookingErrMsg(data.error || "Failed to book appointment.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingErrMsg("An unexpected error occurred.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground">
            Arogya<span className="text-teal-600">Find</span> • Doctor Discovery & Appointment Booking
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Search & Filter Bar */}
        <Card className="p-4 border-border bg-card shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Query Input */}
            <div className="relative col-span-1 sm:col-span-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchDoctors()}
                placeholder={dict.doctors.searchPlaceholder}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Location Selector */}
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder={dict.doctors.locationPlaceholder}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Search Trigger */}
            <Button
              variant="clinical"
              size="sm"
              onClick={fetchDoctors}
              className="gap-1.5 font-bold text-xs h-9"
            >
              <Search className="h-4 w-4" />
              <span>{dict.common.search}</span>
            </Button>
          </div>

          {/* AYUSH System Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              {dict.doctors.filterAyush}:
            </span>

            {[
              { label: dict.doctors.allSystems, value: "ALL" },
              { label: dict.doctors.ayurveda, value: "AYURVEDA" },
              { label: dict.doctors.yogaNaturopathy, value: "YOGA_NATUROPATHY" },
              { label: dict.doctors.unani, value: "UNANI" },
              { label: dict.doctors.siddha, value: "SIDDHA" },
              { label: dict.doctors.homeopathy, value: "HOMEOPATHY" },
              { label: dict.doctors.allopathy, value: "ALLOPATHY" },
            ].map((sys) => (
              <button
                key={sys.value}
                type="button"
                onClick={() => setSelectedAyush(sys.value)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  selectedAyush === sys.value
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {sys.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Doctor Directory Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Verified Practitioners ({doctors.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-semibold animate-pulse">
              Searching verified medical directory...
            </div>
          ) : doctors.length === 0 ? (
            <Card className="p-8 text-center text-xs text-muted-foreground border-dashed">
              No verified doctors found matching your selected criteria. Try adjusting filters.
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <Card key={doc._id} className="border-border shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="clinical" className="uppercase text-[10px]">
                            {doc.ayushSystem}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-semibold">
                            Reg: {doc.registrationNumber}
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold text-foreground">
                          Dr. {doc.userId?.fullName || "Practitioner"}
                        </CardTitle>
                        <p className="text-xs text-teal-600 font-semibold">{doc.specialization}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-teal-600">
                          ₹{doc.consultationFee}
                        </span>
                        <span className="block text-[10px] text-muted-foreground font-medium">
                          {dict.doctors.consultationFee}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    {/* Availability Banner */}
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{dict.doctors.availableBadge}: 10:00 AM – 01:00 PM</span>
                      </div>
                      <Badge variant="verified" className="text-[9px]">ACTIVE</Badge>
                    </div>

                    {/* Chamber Map & Location */}
                    <DoctorChamberMap
                      chamber={doc.chamberInformation || { clinicName: "Clinical Chamber" }}
                      doctorName={doc.userId?.fullName}
                    />
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-end gap-2">
                    <Button
                      variant="clinical"
                      size="sm"
                      onClick={() => setSelectedDocForBooking(doc)}
                      className="text-xs font-bold gap-1 shadow-sm"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dict.doctors.bookAppointmentBtn}</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Appointment Booking Modal */}
      {selectedDocForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-50">
          <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground">
            <div className="flex items-start justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Book Appointment with Dr. {selectedDocForBooking.userId?.fullName}
                </h3>
                <p className="text-xs text-teal-600 font-semibold">
                  {selectedDocForBooking.specialization} • Fee: ₹{selectedDocForBooking.consultationFee}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForBooking(null)}
                className="text-muted-foreground hover:text-foreground font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {bookingSuccessMsg && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center">
                {bookingSuccessMsg}
              </div>
            )}

            {bookingErrMsg && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-bold text-rose-700 dark:text-rose-300 text-center">
                {bookingErrMsg}
              </div>
            )}

            {/* Date & Time Slot Picker */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Select Date:</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-xl border border-input p-2.5 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Select Available Time Slot:</label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTimeSlot(slot)}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        bookingTimeSlot === slot
                          ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                          : "bg-muted/40 text-foreground border-border hover:border-teal-500/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocForBooking(null)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                variant="clinical"
                size="sm"
                onClick={handleBookAppointment}
                disabled={isBooking}
                className="text-xs font-bold gap-1 shadow-md"
              >
                <span>{isBooking ? "Booking..." : "Confirm Booking"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
