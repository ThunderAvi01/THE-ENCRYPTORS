import React from "react";
import { MapPin, Navigation, Hospital, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FacilityMapLocator() {
  const nearbyClinics = [
    { name: "Apollo Specialty Clinic", dist: "1.2 km", time: "5 mins", type: "Multispecialty" },
    { name: "Max Healthcare Care Center", dist: "2.8 km", time: "12 mins", type: "Hospital & OPD" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-teal-600" />
          <h4 className="text-sm font-semibold text-foreground">Nearby Verified Healthcare Facilities</h4>
        </div>
        <Badge variant="clinical">Geolocation Module</Badge>
      </div>

      <div className="space-y-2">
        {nearbyClinics.map((clinic, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/30 text-xs">
            <div className="flex items-center gap-2">
              <Hospital className="h-4 w-4 text-teal-600 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{clinic.name}</p>
                <p className="text-[11px] text-muted-foreground">{clinic.type}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-foreground">{clinic.dist}</span>
              <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                <Navigation className="h-2.5 w-2.5" />
                {clinic.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
