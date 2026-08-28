import React from "react";
import { Calendar, Clock, MapPin, Video, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppointmentBookingWidget() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-600" />
          <h4 className="text-sm font-semibold text-foreground">Consultation Scheduling</h4>
        </div>
        <Badge variant="clinical">Supporting Module</Badge>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              Dr
            </div>
            <div>
              <p className="font-semibold text-foreground">Dr. Priya Sharma, MD</p>
              <p className="text-muted-foreground">General Medicine • AIIMS New Delhi</p>
            </div>
          </div>
          <Badge variant="verified">Slot Open (Today)</Badge>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 p-2.5 rounded-lg border border-teal-500/30 bg-teal-500/5 text-center">
            <Video className="h-4 w-4 mx-auto text-teal-600 mb-1" />
            <span className="font-medium text-foreground block">Tele-Consult</span>
            <span className="text-[10px] text-muted-foreground">4:30 PM IST</span>
          </div>
          <div className="flex-1 p-2.5 rounded-lg border border-border bg-card text-center opacity-70">
            <MapPin className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <span className="font-medium text-foreground block">In-Clinic Visit</span>
            <span className="text-[10px] text-muted-foreground">Apollo Clinic</span>
          </div>
        </div>
      </div>

      <Button variant="clinical" size="sm" className="w-full">
        Confirm Appointment & Attach Intake Case
      </Button>
    </div>
  );
}
