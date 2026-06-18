"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/types/property";

type LatLng = [number, number];
type NominatimResult = { lat: string; lon: string };

const FLORIANOPOLIS: LatLng = [-27.5954, -48.548];

type PoiCategory = "restaurant" | "attraction" | "pharmacy" | "supermarket" | "hospital";

type Poi = {
  id: number;
  lat: number;
  lon: number;
  name: string;
  category: PoiCategory;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; amenity?: string; tourism?: string; shop?: string };
};

const CATEGORY_CONFIG: Record<PoiCategory, { label: string; color: string; emoji: string }> = {
  restaurant:   { label: "Restaurantes",   color: "#f97316", emoji: "🍽️" },
  attraction:   { label: "Atrações",       color: "#3b82f6", emoji: "⭐" },
  pharmacy:     { label: "Farmácias",      color: "#22c55e", emoji: "💊" },
  supermarket:  { label: "Mercados",       color: "#a855f7", emoji: "🛒" },
  hospital:     { label: "Hospitais",      color: "#ef4444", emoji: "🏥" },
};

function makeDivIcon(emoji: string, bg: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${bg};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,.22);border:2px solid #fff;">${emoji}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function MapResizer({ isActive }: { isActive: boolean }) {
  const map = useMap();
  useEffect(() => {
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

async function fetchPois(lat: number, lon: number): Promise<Poi[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="restaurant"]["name"](around:800,${lat},${lon});
      node["tourism"="attraction"]["name"](around:1200,${lat},${lon});
      node["amenity"="pharmacy"]["name"](around:800,${lat},${lon});
      node["shop"="supermarket"]["name"](around:800,${lat},${lon});
      node["amenity"="hospital"]["name"](around:1500,${lat},${lon});
    );
    out body;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  const data: { elements: OverpassElement[] } = await res.json();

  const byCategory: Partial<Record<PoiCategory, Poi[]>> = {};

  for (const el of data.elements) {
    const elLat = el.lat ?? el.center?.lat;
    const elLon = el.lon ?? el.center?.lon;
    const name = el.tags?.name;
    if (!elLat || !elLon || !name) continue;

    let category: PoiCategory | null = null;
    if (el.tags?.amenity === "restaurant") category = "restaurant";
    else if (el.tags?.tourism === "attraction") category = "attraction";
    else if (el.tags?.amenity === "pharmacy") category = "pharmacy";
    else if (el.tags?.shop === "supermarket") category = "supermarket";
    else if (el.tags?.amenity === "hospital") category = "hospital";
    if (!category) continue;

    if (!byCategory[category]) byCategory[category] = [];
    if ((byCategory[category]!).length < 6) {
      byCategory[category]!.push({ id: el.id, lat: elLat, lon: elLon, name, category });
    }
  }

  return Object.values(byCategory).flat() as Poi[];
}

type Props = { property: Property; isActive?: boolean };

export default function MapView({ property, isActive = true }: Props) {
  const [center, setCenter] = useState<LatLng>(FLORIANOPOLIS);
  const [pois, setPois] = useState<Poi[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      .then(async (data: NominatimResult[]) => {
        const coords: LatLng = data[0]
          ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          : FLORIANOPOLIS;
        setCenter(coords);
        const nearbyPois = await fetchPois(coords[0], coords[1]).catch(() => []);
        setPois(nearbyPois);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [property.address]);

  if (!ready) {
    return <div className="h-[560px] animate-pulse rounded-2xl bg-slate-100" />;
  }

  const propertyIcon = makeDivIcon("🏠", "#F07060");

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <MapContainer center={center} zoom={15} style={{ height: "520px" }} scrollWheelZoom={false}>
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
          {pois.map((poi) => {
            const cfg = CATEGORY_CONFIG[poi.category];
            return (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lon]}
                icon={makeDivIcon(cfg.emoji, cfg.color)}
              >
                <Popup>
                  <strong style={{ color: "#1a2a4a" }}>{poi.name}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: cfg.color }}>{cfg.label}</span>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="flex items-center gap-2 bg-white px-4 py-3 text-xs text-slate-500">
          <span className="text-[#F07060]">📍</span>
          {property.address.street}, {property.address.number} —{" "}
          {property.address.neighborhood}, {property.address.city} — {property.address.state}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { emoji: "🏠", label: "Imóvel", color: "#F07060" },
          ...Object.values(CATEGORY_CONFIG).map(({ emoji, label, color }) => ({ emoji, label, color })),
        ].map(({ emoji, label, color }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm"
          >
            <span>{emoji}</span>
            <span style={{ color }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
