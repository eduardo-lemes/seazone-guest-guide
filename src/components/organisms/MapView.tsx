"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/types/property";

type LatLng = [number, number];
type NominatimResult = { lat: string; lon: string };

const FLORIANOPOLIS: LatLng = [-27.5954, -48.548];

function makeDivIcon(emoji: string, bg: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${bg};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.25);border:2px solid #fff;">${emoji}</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -22],
  });
}

function MapResizer({ isActive }: { isActive: boolean }) {
  const map = useMap();
  useEffect(() => {
    // Always invalidate on mount (first render is already visible)
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => map.invalidateSize());
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => map.invalidateSize());
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, [isActive, map]);
  return null;
}

type Props = { property: Property; isActive?: boolean };

export default function MapView({ property, isActive = true }: Props) {
  const [center, setCenter] = useState<LatLng>(FLORIANOPOLIS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fix Leaflet default icon resolution issue with webpack
    const IconDefault = L.Icon.Default as unknown as {
      prototype: Record<string, unknown>;
      mergeOptions: (opts: Record<string, string>) => void;
    };
    delete IconDefault.prototype._getIconUrl;
    IconDefault.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const q = `${property.address.street}, ${property.address.neighborhood}, ${property.address.city}, Brasil`;
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "User-Agent": "SeazoneGuestGuide/1.0" } }
    )
      .then((r) => r.json())
      .then((data: NominatimResult[]) => {
        if (data[0]) setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [property.address]);

  if (!ready) {
    return <div className="h-[560px] animate-pulse rounded-2xl bg-slate-100" />;
  }

  const propertyIcon = makeDivIcon("🏠", "#F07060");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer center={center} zoom={15} style={{ height: "560px" }} scrollWheelZoom={false}>
        <MapResizer isActive={isActive} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={propertyIcon}>
          <Popup>
            <strong style={{ color: "#1a2a4a" }}>{property.name}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {property.address.neighborhood}, {property.address.city}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="flex items-center gap-2 bg-white px-4 py-3 text-xs text-slate-500">
        <span className="text-[#F07060]">📍</span>
        {property.address.street}, {property.address.number} —{" "}
        {property.address.neighborhood}, {property.address.city} — {property.address.state}
      </div>
    </div>
  );
}
