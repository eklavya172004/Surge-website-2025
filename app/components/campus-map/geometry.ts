import type { CampusPlace, PlaceCategory } from "./places";

export type Point = [number, number];
export type MapView = "2d" | "3d";
export type CampusFeature = {
  id: string;
  kind: "building" | "road" | "path" | "water" | "sport" | "green" | "parking" | "tree-row";
  points: Point[];
  name?: string;
  sport?: string;
  height?: number;
};
export const ORIGIN: Point = [77.5745, 28.526];
const LONGITUDE_METERS = 111320 * Math.cos(ORIGIN[1] * Math.PI / 180);
const ANGLE = -42 * Math.PI / 180;

export function toWorld(longitude: number, latitude: number): Point {
  return [(longitude - ORIGIN[0]) * LONGITUDE_METERS, (ORIGIN[1] - latitude) * 110540];
}

export function project([x, y]: Point, view: MapView): Point {
  if (view === "2d") return [x, y];
  return [x * Math.cos(ANGLE) - y * Math.sin(ANGLE), (x * Math.sin(ANGLE) + y * Math.cos(ANGLE)) * 0.66];
}

export function unproject([x, y]: Point, view: MapView): Point {
  if (view === "2d") return [x, y];
  return [x * Math.cos(ANGLE) + y / 0.66 * Math.sin(ANGLE), -x * Math.sin(ANGLE) + y / 0.66 * Math.cos(ANGLE)];
}

// Heights are illustrative. Give the arena enough relief to read as a landmark.
export function buildingLift(feature: CampusFeature, view: MapView) {
  return view === "3d" && feature.kind === "building" ? (feature.id === "454615138" ? 12 : feature.height ?? 10) * 1.35 : 0;
}

export function bounds(points: Point[]) {
  return { minX: Math.min(...points.map((p) => p[0])), maxX: Math.max(...points.map((p) => p[0])), minY: Math.min(...points.map((p) => p[1])), maxY: Math.max(...points.map((p) => p[1])) };
}

export function centroid(points: Point[]): Point {
  const ring = points.length > 1 && points[0][0] === points.at(-1)?.[0] && points[0][1] === points.at(-1)?.[1] ? points.slice(0, -1) : points;
  return [ring.reduce((total, point) => total + point[0], 0) / ring.length, ring.reduce((total, point) => total + point[1], 0) / ring.length];
}

export function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function distanceToPolygon(point: Point, polygon: Point[]) {
  let distance = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / lengthSquared)) : 0;
    distance = Math.min(distance, Math.hypot(point[0] - a[0] - t * dx, point[1] - a[1] - t * dy));
  }
  return distance;
}

export function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchPlaces(places: CampusPlace[], query: string, category: PlaceCategory | "all") {
  const searchable = (value: string) => normalizeSearch(value).replace(/\b(court|hall|stall|ground|shop|arena)s\b/g, "$1");
  const words = searchable(query).split(/\s+/).filter(Boolean);
  return places.filter((place) => {
    // The shared football/futsal ground is also a food-stall destination.
    const matchesCategory = category === "all" || place.category === category || (category === "food" && place.id === "football-futsal");
    const text = searchable([place.name, place.shortName, place.category, place.description, ...place.tags, ...place.aliases].join(" "));
    return matchesCategory && words.every((word) => text.includes(word));
  });
}

export function directionsUrl(place: CampusPlace) {
  const params = new URLSearchParams({ api: "1", destination: `${place.latitude},${place.longitude}`, travelmode: place.id === "gate1" ? "driving" : "walking" });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function pathData(points: Point[], close = true) {
  return points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + (close ? " Z" : "");
}
