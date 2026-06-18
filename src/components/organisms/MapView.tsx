"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Home } from "lucide-react";
import type { Property } from "@/types/property";

type LatLng = [number, number];
type NominatimResult = { lat: string; lon: string };

const BRAZIL_CENTER: LatLng = [-15.7801, -47.9292];

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
  restaurant:  { label: "Restaurantes", color: "#f97316", emoji: "🍽️" },
  attraction:  { label: "Atrações",     color: "#3b82f6", emoji: "⭐" },
  pharmacy:    { label: "Farmácias",    color: "#22c55e", emoji: "💊" },
  supermarket: { label: "Mercados",     color: "#a855f7", emoji: "🛒" },
  hospital:    { label: "Hospitais",    color: "#ef4444", emoji: "🏥" },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as PoiCategory[];

function makeDivIcon(emoji: string, bg: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${bg};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,.22);border:2px solid #fff;">${emoji}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function makeFocusIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:48px;height:48px;border-radius:50%;background:rgba(240,112,96,0.22);"></div><div style="position:relative;background:#F07060;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 14px rgba(240,112,96,0.55);border:3px solid white;">📍</div></div>`,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -28],
  });
}

// ---------- Map controllers ----------

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

function FocusMarker({ position, name }: { position: LatLng; name: string }) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      markerRef.current?.openPopup();
    }, 900); // wait for flyTo animation to settle
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position[0], position[1]]);

  return (
    <Marker position={position} icon={makeFocusIcon()} ref={markerRef}>
      <Popup>
        <strong style={{ color: "#1a2a4a", fontSize: "13px" }}>{name}</strong>
      </Popup>
    </Marker>
  );
}

function MapController({
  focusName,
  onFocusHandled,
  onFocusResolved,
  returnHome,
  homeCenter,
  onReturnHandled,
}: {
  focusName: string | null;
  onFocusHandled: () => void;
  onFocusResolved: (lat: number, lon: number, name: string) => void;
  returnHome: boolean;
  homeCenter: LatLng;
  onReturnHandled: () => void;
}) {
  const map = useMap();

  // Focus on a named POI via Nominatim geocoding
  useEffect(() => {
    if (!focusName) return;
    const [lat, lon] = homeCenter;
    const delta = 0.15;
    const viewbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    // Try within property area first, then unrestricted
    const attempts = [
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(focusName)}&format=json&limit=1&viewbox=${viewbox}&bounded=1`,
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(focusName)}&format=json&limit=1&viewbox=${viewbox}&bounded=0`,
    ];
    void (async () => {
      for (const url of attempts) {
        try {
          const data: NominatimResult[] = await fetch(url, {
            headers: { "User-Agent": "SeazoneGuestGuide/1.0" },
          }).then((r) => r.json());
          if (data[0]) {
            const plat = parseFloat(data[0].lat);
            const plon = parseFloat(data[0].lon);
            map.flyTo([plat, plon], 17, { animate: true, duration: 1.2 });
            onFocusResolved(plat, plon, focusName);
            onFocusHandled();
            return;
          }
        } catch { /* try next */ }
      }
      // Place not found — fly back to property area so the button still does something
      map.flyTo(homeCenter, 15, { animate: true, duration: 0.8 });
      onFocusHandled();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusName]);

  // Return to property center
  useEffect(() => {
    if (!returnHome) return;
    map.flyTo(homeCenter, 15, { animate: true, duration: 1.0 });
    onReturnHandled();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnHome]);

  return null;
}

// ---------- Data fetching ----------

async function fetchPois(lat: number, lon: number): Promise<Poi[]> {
  const query = `
    [out:json][timeout:15][maxsize:2097152];
    (
      node["amenity"="restaurant"]["name"](around:800,${lat},${lon});
      node["tourism"="attraction"]["name"](around:1200,${lat},${lon});
      node["amenity"="pharmacy"]["name"](around:800,${lat},${lon});
      node["shop"="supermarket"]["name"](around:800,${lat},${lon});
      node["amenity"="hospital"]["name"](around:1000,${lat},${lon});
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

// ---------- Main component ----------

type Props = {
  property: Property;
  isActive?: boolean;
  focusName?: string | null;
  onFocusHandled?: () => void;
};

export default function MapView({
  property,
  isActive = true,
  focusName = null,
  onFocusHandled = () => {},
}: Props) {
  const [center, setCenter] = useState<LatLng>(BRAZIL_CENTER);
  const [pois, setPois] = useState<Poi[]>([]);
  const [ready, setReady] = useState(false);
  const [poisLoading, setPoisLoading] = useState(true);
  const [returnHome, setReturnHome] = useState(false);
  const [focusPoint, setFocusPoint] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<PoiCategory>>(
    new Set(ALL_CATEGORIES)
  );

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

    async function geocode(): Promise<LatLng> {
      const tryQuery = async (q: string): Promise<LatLng | null> => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
            { headers: { "User-Agent": "SeazoneGuestGuide/1.0" } }
          );
          const data: NominatimResult[] = await res.json();
          if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } catch { /* ignore */ }
        return null;
      };

      const { street, neighborhood, city, state } = property.address;
      return (
        (await tryQuery(`${street}, ${neighborhood}, ${city}, Brasil`)) ??
        (await tryQuery(`${city}, ${state}, Brasil`)) ??
        BRAZIL_CENTER
      );
    }

    geocode().then((coords) => {
      setCenter(coords);
      setReady(true);
      fetchPois(coords[0], coords[1])
        .catch(() => [])
        .then((nearbyPois) => {
          setPois(nearbyPois);
          setPoisLoading(false);
        });
    });
  }, [property.address]);

  function toggleCategory(cat: PoiCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  if (!ready) {
    return <div className="h-[560px] animate-pulse rounded-2xl bg-slate-100" />;
  }

  const propertyIcon = makeDivIcon("🏠", "#F07060");
  const visiblePois = pois.filter((p) => activeCategories.has(p.category));

  return (
    <div className="space-y-3 isolate">
      {/* Map container */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <MapContainer center={center} zoom={15} style={{ height: "520px" }} scrollWheelZoom={true}>
          <MapResizer isActive={isActive} />
          <MapController
            focusName={focusName}
            onFocusHandled={onFocusHandled}
            onFocusResolved={(lat, lon, name) => setFocusPoint({ lat, lon, name })}
            returnHome={returnHome}
            homeCenter={center}
            onReturnHandled={() => setReturnHome(false)}
          />
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
          {focusPoint && (
            <FocusMarker
              position={[focusPoint.lat, focusPoint.lon]}
              name={focusPoint.name}
            />
          )}
          {visiblePois.map((poi) => {
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

        {/* Return to property overlay button */}
        <button
          onClick={() => { setReturnHome(true); setFocusPoint(null); }}
          className="absolute right-3 top-3 z-[1001] flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg active:scale-95"
        >
          <Home size={13} className="text-[#F07060]" />
          Voltar ao imóvel
        </button>

        {/* Address bar */}
        <div className="border-t border-slate-100 bg-white px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <span className="text-[#F07060]">📍</span>
            {property.address.street}, {property.address.number}
          </p>
          <p className="mt-0.5 pl-6 text-xs text-slate-500">
            {property.address.neighborhood}, {property.address.city} — {property.address.state}
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">
          {poisLoading ? "Carregando pontos…" : "Filtrar:"}
        </span>
        {ALL_CATEGORIES.map((cat) => {
          const { emoji, label, color } = CATEGORY_CONFIG[cat];
          const isActive = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition-all hover:opacity-90 active:scale-95"
              style={
                isActive
                  ? { backgroundColor: color, borderColor: color, color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#94a3b8" }
              }
            >
              <span>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
