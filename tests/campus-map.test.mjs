import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CAMPUS_PLACES } from "../app/components/campus-map/places.ts";
import { directionsUrl, distanceToPolygon, normalizeSearch, pointInPolygon, project, searchPlaces, toWorld, unproject } from "../app/components/campus-map/geometry.ts";

const geometry = JSON.parse(readFileSync(new URL("../app/components/campus-map/campus-geometry.json", import.meta.url), "utf8"));
const ids = (places) => places.map((place) => place.id);

test("campus search understands local names, accents and shared indoor sports", () => {
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "DH 1", "all")), ["dh1"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "dh2", "all")), ["dh2"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "dining halls", "all")), ["dh1", "dh2"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "Nescafe", "all")), ["nescafe"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "SARC", "food")), ["sarc"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "table tennis", "sports")), ["isc"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "volleyball", "all")), ["isc", "volleyball"]);
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "badminton courts", "all")), ["isc"]);
  assert.equal(normalizeSearch("  C & D / Nescafé! "), "c d nescafe");
});

test("food filters include the shared futsal food-stall area and Chess Garden", () => {
  const food = ids(searchPlaces(CAMPUS_PLACES, "", "food"));
  assert.ok(food.includes("football-futsal"));
  assert.ok(food.includes("chess-garden"));
  assert.ok(food.includes("dh1") && food.includes("dh2"));
  assert.ok(!food.includes("isc"));
  assert.deepEqual(ids(searchPlaces(CAMPUS_PLACES, "", "essentials")), ["gate1"]);
  assert.deepEqual(searchPlaces(CAMPUS_PLACES, "missing venue", "all"), []);
});

test("2D and isometric projections preserve geographic positions through pan and zoom", () => {
  for (const place of CAMPUS_PLACES) {
    const world = toWorld(place.longitude, place.latitude);
    for (const view of ["2d", "3d"]) {
      const roundTrip = unproject(project(world, view), view);
      assert.ok(Math.abs(roundTrip[0] - world[0]) < 1e-8);
      assert.ok(Math.abs(roundTrip[1] - world[1]) < 1e-8);
    }
  }
});

test("supplied venue pins sit on campus, with a boundary tolerance for Gate 1", () => {
  assert.equal(CAMPUS_PLACES.length, 15);
  assert.equal(new Set(ids(CAMPUS_PLACES)).size, 15);
  for (const place of CAMPUS_PLACES) {
    const point = toWorld(place.longitude, place.latitude);
    // The organizer's Gate 1 pin is on the approach, 27 m outside the OSM fence.
    assert.ok(pointInPolygon(point, geometry.boundary) || (place.id === "gate1" && distanceToPolygon(point, geometry.boundary) < 35), place.name);
  }
  assert.equal(pointInPolygon(toWorld(77.2, 28.6), geometry.boundary), false);
});

test("boundary distance handles edges, vertices and repeated ring endpoints", () => {
  const ring = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
  assert.equal(distanceToPolygon([5, -3], ring), 3);
  assert.equal(distanceToPolygon([10, 5], ring), 0);
  assert.equal(distanceToPolygon([13, 14], ring), 5);
});

test("directions target the exact destination pin and use driving only for the entrance", () => {
  for (const place of CAMPUS_PLACES) {
    const url = new URL(directionsUrl(place));
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.searchParams.get("destination"), `${place.latitude},${place.longitude}`);
    assert.equal(url.searchParams.get("travelmode"), place.id === "gate1" ? "driving" : "walking");
    assert.equal(url.searchParams.has("origin"), false);
    assert.ok(place.mapsUrl.startsWith("https://maps.app.goo.gl/"));
    for (const id of place.geometryIds) assert.ok(geometry.features.some((feature) => feature.id === id), `${place.name}: missing geometry ${id}`);
  }
});
