// Refresh the checked-in campus geometry from an OpenStreetMap API map extract.
// Usage: node scripts/build-campus-geometry.mjs /path/to/osm-map.json
// Source: https://api.openstreetmap.org/api/0.6/map.json?bbox=77.5675,28.5175,77.582,28.5342
// OSM data is © OpenStreetMap contributors, available under ODbL.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) throw new Error("Pass an OpenStreetMap JSON extract as the first argument.");
const { elements } = JSON.parse(readFileSync(input, "utf8"));
const nodes = new Map(elements.filter((item) => item.type === "node").map((item) => [item.id, item]));
const origin = [77.5745, 28.526];
const metersPerLongitude = 111320 * Math.cos(origin[1] * Math.PI / 180);
const project = (node) => [
  Math.round((node.lon - origin[0]) * metersPerLongitude * 10) / 10,
  Math.round((origin[1] - node.lat) * 110540 * 10) / 10,
];
const ring = (way) => way.nodes.filter((id) => nodes.has(id)).map((id) => project(nodes.get(id)));
const inside = (point, polygon) => {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) result = !result;
  }
  return result;
};
const boundary = ring(elements.find((item) => item.type === "way" && item.id === 369248213));
const features = [];
for (const item of elements.filter((element) => element.type === "way")) {
  if (item.id === 369248213) continue;
  const tags = item.tags ?? {};
  const points = ring(item);
  if (points.length < 2 || !points.some((point) => inside(point, boundary))) continue;
  let kind;
  if (tags.building && !tags.construction && tags.building !== "construction") kind = "building";
  else if (tags.highway) kind = ["footway", "path", "steps", "pedestrian"].includes(tags.highway) ? "path" : "road";
  else if (tags.natural === "water") kind = "water";
  else if (tags.sport || ["pitch", "track"].includes(tags.leisure)) kind = "sport";
  else if (["park", "garden", "golf_course"].includes(tags.leisure) || ["grass", "forest", "meadow", "recreation_ground"].includes(tags.landuse) || ["wood", "scrub"].includes(tags.natural)) kind = "green";
  else if (tags.amenity === "parking") kind = "parking";
  else if (tags.natural === "tree_row") kind = "tree-row";
  if (!kind) continue;
  const height = Number.parseFloat(tags.height) || (Number(tags["building:levels"]) || (tags.building === "dormitory" ? 5 : 2)) * 3.2;
  features.push({ id: String(item.id), kind, points, ...(tags.name ? { name: tags.name } : {}), ...(tags.sport ? { sport: tags.sport } : {}), ...(kind === "building" ? { height: Math.min(height, 24) } : {}) });
}
const output = {
  source: "https://www.openstreetmap.org/way/369248213",
  license: "ODbL-1.0",
  attribution: "© OpenStreetMap contributors",
  retrieved: "2026-10-20",
  note: "Building footprints, paths and grounds are sourced geometry. Unspecified building heights and landscape symbols are illustrative.",
  origin, boundary, features,
};
const destination = fileURLToPath(new URL("../app/components/campus-map/campus-geometry.json", import.meta.url));
writeFileSync(destination, JSON.stringify(output));
console.log(`Saved ${features.length} campus features to ${destination}`);
