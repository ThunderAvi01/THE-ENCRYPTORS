"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Building2, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChamberLocation {
  clinicName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactNumber?: string;
  lat?: number;
  lng?: number;
}

interface DoctorChamberMapProps {
  chamber: ChamberLocation;
  doctorName?: string;
}

export function DoctorChamberMap({ chamber, doctorName }: DoctorChamberMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [mapError, setMapError] = useState(false);

  const fullAddress = [
    chamber.clinicName,
    chamber.addressLine1,
    chamber.addressLine2,
    chamber.city,
    chamber.state,
    chamber.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const mapsQuery = encodeURIComponent(fullAddress || `${chamber.city || "New Delhi"}, India`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
          <h4 className="text-xs font-bold text-foreground">
            {chamber.clinicName || "Doctor's Clinical Chamber"}
          </h4>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-1"
        >
          <span>Get Directions</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Google Maps Embed OR Graceful Address Fallback */}
      {apiKey && !mapError ? (
        <div className="h-44 w-full rounded-xl overflow-hidden border border-border relative">
          <iframe
            title={`Map for ${chamber.clinicName || "Doctor Chamber"}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapsQuery}`}
            onError={() => setMapError(true)}
          />
        </div>
      ) : (
        /* Graceful Non-Breaking Address Card Fallback */
        <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-1.5 text-xs text-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">{chamber.addressLine1 || "OPD Chamber Wing, Block B"}</p>
              {chamber.addressLine2 && <p className="text-muted-foreground">{chamber.addressLine2}</p>}
              <p className="text-muted-foreground">
                {chamber.city || "City"}, {chamber.state || "State"} {chamber.pincode ? `- ${chamber.pincode}` : ""}
              </p>
            </div>
          </div>

          {chamber.contactNumber && (
            <div className="flex items-center gap-2 pt-1 text-muted-foreground font-medium">
              <Phone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Contact: {chamber.contactNumber}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
