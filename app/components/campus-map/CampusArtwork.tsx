"use client";

import { memo, useMemo } from "react";
import rawGeometry from "./campus-geometry.json";
import { CAMPUS_PLACES } from "./places";
import { bounds, centroid, pathData, pointInPolygon, project, type CampusFeature, type MapView, type Point } from "./geometry";

export const CAMPUS_BOUNDARY = rawGeometry.boundary as Point[];
export const CAMPUS_FEATURES = rawGeometry.features as CampusFeature[];
const SPORT_GROUND_IDS = new Set(CAMPUS_PLACES.filter((place) => place.category === "sports").flatMap((place) => place.geometryIds));

const interpolate = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Landscape symbols sit beside sourced paths and in green spaces. They are
// illustrative, not an inventory of individual trees.
function landscapeTrees(): Point[] {
  const exclusions = CAMPUS_FEATURES.filter((feature) => ["building", "water", "sport"].includes(feature.kind) || SPORT_GROUND_IDS.has(feature.id));
  const trees: Point[] = [];
  const add = (point: Point) => {
    if (pointInPolygon(point, CAMPUS_BOUNDARY) && !exclusions.some((feature) => pointInPolygon(point, feature.points)) && !trees.some((other) => Math.hypot(point[0] - other[0], point[1] - other[1]) < 17)) trees.push(point);
  };
  for (const feature of CAMPUS_FEATURES.filter((item) => item.kind === "road" || item.kind === "tree-row")) {
    for (let i = 1; i < feature.points.length; i++) {
      const a = feature.points[i - 1], b = feature.points[i];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      for (let distance = 12; distance < length; distance += 34) {
        const point = interpolate(a, b, distance / length);
        for (const side of [-1, 1]) add([point[0] + (b[1] - a[1]) / length * 13 * side, point[1] - (b[0] - a[0]) / length * 13 * side]);
      }
    }
  }
  for (const feature of CAMPUS_FEATURES.filter((item) => item.kind === "green")) {
    const box = bounds(feature.points);
    for (let x = box.minX + 18; x < box.maxX; x += 48) {
      for (let y = box.minY + 17; y < box.maxY; y += 55) {
        const point: Point = [x + Math.sin(x * 1.7 + y) * 12, y + Math.cos(y * 1.3 + x) * 10];
        if (pointInPolygon(point, feature.points)) add(point);
      }
    }
  }
  return trees.slice(0, 550);
}
const TREES = landscapeTrees();

function GroundMarkings({ feature, prefix }: { feature: CampusFeature; prefix: string }) {
  const points = feature.points.slice(0, -1);
  const box = bounds(feature.points);
  const center = centroid(feature.points);
  const clipId = `${prefix}-pitch-${feature.id}`;
  if (feature.sport === "cricket") {
    return <g clipPath={`url(#${clipId})`}>
      <defs><clipPath id={clipId}><path d={pathData(feature.points)} /></clipPath></defs>
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={box.minX + (box.maxX - box.minX) / 9 * i} y={box.minY} width={(box.maxX - box.minX) / 9} height={box.maxY - box.minY} fill={i % 2 ? "#91ad70" : "#85a465"} />)}
      <path d={pathData(feature.points)} fill="none" stroke="#eef1d5" strokeWidth="5" />
      <rect x={center[0] - 5} y={center[1] - 12} width="10" height="24" rx="1" fill="#dec89e" />
      <path d={`M${center[0] - 7},${center[1] - 9}h14 M${center[0] - 7},${center[1] + 9}h14`} stroke="#fff9eb" strokeWidth="1" />
    </g>;
  }
  if (feature.sport === "running") return <g fill="none" stroke="#f0ddd2" strokeWidth="2"><path d={pathData(feature.points)} /><path d={pathData(feature.points)} strokeWidth="7" opacity="0.4" /></g>;
  if (points.length !== 4) return null;
  const [a, b, , d] = points;
  const matrix = `matrix(${(b[0] - a[0]) / 100} ${(b[1] - a[1]) / 100} ${(d[0] - a[0]) / 60} ${(d[1] - a[1]) / 60} ${a[0]} ${a[1]})`;
  return <g transform={matrix} fill="none" stroke="#f7f8e9" strokeWidth="0.8" opacity="0.9">
    <rect x="4" y="4" width="92" height="52" />
    {feature.sport === "soccer" ? <>
      <path d="M50,4v52 M4,14h14v32H4 M96,14H82v32h14 M4,22h6v16H4 M96,22h-6v16h6" />
      <circle cx="50" cy="30" r="8" /><circle cx="50" cy="30" r="0.8" fill="#f7f8e9" />
    </> : feature.sport === "basketball" ? <>
      <path d="M50,4v52 M4,21h16v18H4 M96,21H80v18h16" /><circle cx="50" cy="30" r="8" />
      <path d="M4,10C40,10 40,50 4,50 M96,10C60,10 60,50 96,50" />
    </> : feature.sport === "tennis" ? <>
      <path d="M50,4v52 M4,12h92 M4,48h92 M26,12v36 M74,12v36 M26,30h48" />
    </> : feature.sport === "volleyball" || feature.sport === "badminton" ? <path d="M50,4v52 M36,4v52 M64,4v52" /> : feature.sport === "chess" ? <>
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={14 + i % 4 * 18} y={10 + Math.floor(i / 4) * 10} width="18" height="10" fill={(i + Math.floor(i / 4)) % 2 ? "#a9bb91" : "#e0e4ca"} stroke="none" />)}
    </> : null}
  </g>;
}

function Building({ feature, view, active }: { feature: CampusFeature; view: MapView; active: boolean }) {
  const lift = view === "3d" ? (feature.height ?? 10) * 1.35 : 0;
  const ground = feature.points.map((point) => project(point, view));
  const roof = ground.map(([x, y]): Point => [x, y - lift]);
  const rectangular = roof.length === 5;
  const [a, b, c, d] = roof;
  return <g>
    {lift > 0 && <path d={pathData(ground.map(([x, y]) => [x + 5, y + 5]))} fill="#657668" opacity="0.14" />}
    {lift > 0 && ground.slice(0, -1).map((point, index) => {
      const next = ground[index + 1];
      return <path key={index} d={pathData([point, next, roof[index + 1], roof[index]])} fill={active ? (next[0] > point[0] ? "#405ac9" : "#243d9b") : next[0] > point[0] ? "#d9d8ca" : "#c3c7b9"} stroke={active ? "#304ac0" : "#bfc6b7"} strokeWidth="0.6" />;
    })}
    <path d={pathData(roof)} fill={active ? "#4967ed" : "#f7f6ec"} stroke={active ? "#233fb8" : "#bec6b7"} strokeWidth={active ? 2 : 1} />
    {rectangular && <>
      {Array.from({ length: Math.max(2, Math.min(10, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 11))) }, (_, index) => {
        const t = (index + 1) / 11;
        return <path key={index} d={pathData([interpolate(a, b, t), interpolate(d, c, t)], false)} fill="none" stroke={active ? "#b4c4ff" : "#e1e4d7"} strokeWidth="1.2" />;
      })}
      <path d={pathData([interpolate(a, c, 0.16), interpolate(b, d, 0.16), interpolate(c, a, 0.16), interpolate(d, b, 0.16)])} fill="none" stroke={active ? "#c5d0ff" : "#e2e6da"} strokeWidth="1" />
    </>}
  </g>;
}

type Props = { view: MapView; selectedGeometry: string[]; prefix: string; focus?: Point };

export const CampusArtwork = memo(function CampusArtwork({ view, selectedGeometry, prefix, focus }: Props) {
  const features = useMemo(() => focus ? CAMPUS_FEATURES.filter((feature) => feature.points.some((point) => Math.hypot(point[0] - focus[0], point[1] - focus[1]) < 210)) : CAMPUS_FEATURES, [focus]);
  const trees = useMemo(() => (focus ? TREES.filter((point) => Math.hypot(point[0] - focus[0], point[1] - focus[1]) < 210) : TREES).map((point) => ({ point, screen: project(point, view) })), [view, focus]);
  const planeX = project([1, 0], view), planeY = project([0, 1], view);
  const matrix = `matrix(${planeX[0]} ${planeX[1]} ${planeY[0]} ${planeY[1]} 0 0)`;
  const objects = [
    ...features.filter((feature) => feature.kind === "building").map((feature) => ({ type: "building" as const, y: Math.max(...feature.points.map((point) => project(point, view)[1])), feature })),
    ...trees.map((tree, i) => ({ type: "tree" as const, y: tree.screen[1], tree, id: i })),
  ].sort((a, b) => a.y - b.y);
  return <g>
    <defs><clipPath id={`${prefix}-campus`}><path d={pathData(CAMPUS_BOUNDARY)} /></clipPath></defs>
    {view === "3d" && <path d={pathData(CAMPUS_BOUNDARY.map((point) => { const p = project(point, view); return [p[0], p[1] + 9]; }))} fill="#ced9c5" stroke="#bdcbb3" strokeWidth="1" />}
    <g transform={matrix}>
      <path d={pathData(CAMPUS_BOUNDARY)} fill="#e9efdd" stroke="#c7d4bd" strokeWidth="2" />
      <g clipPath={`url(#${prefix}-campus)`}>
        {features.filter((feature) => feature.kind === "green" || feature.kind === "parking").map((feature) => <path key={feature.id} d={pathData(feature.points)} fill={feature.kind === "parking" ? "#dde0d4" : SPORT_GROUND_IDS.has(feature.id) ? "#b7cb9e" : "#d9e5c8"} stroke={selectedGeometry.includes(feature.id) ? "#304ffe" : "#d1ddc2"} strokeWidth={selectedGeometry.includes(feature.id) ? 5 : 1} />)}
        {features.filter((feature) => feature.kind === "water").map((feature) => <g key={feature.id}><path d={pathData(feature.points)} fill="#9eced1" stroke="#cedfd0" strokeWidth="10" /><path d={pathData(feature.points)} fill="none" stroke="#c5e4dd" strokeWidth="2" /></g>)}
        {features.filter((feature) => feature.kind === "road" || feature.kind === "path").map((feature) => <g key={feature.id} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={pathData(feature.points, false)} stroke={feature.kind === "road" ? "#c6cec0" : "#d3dcc9"} strokeWidth={feature.kind === "road" ? 10 : 4} />
          <path d={pathData(feature.points, false)} stroke={feature.kind === "road" ? "#fbfcf5" : "#f4f4e7"} strokeWidth={feature.kind === "road" ? 7 : 2.5} />
        </g>)}
        {features.filter((feature) => feature.kind === "sport").map((feature) => <g key={feature.id}>
          <path d={pathData(feature.points)} fill={feature.sport === "soccer" || feature.sport === "cricket" ? "#8eaa70" : feature.sport === "running" ? "#bc9981" : feature.sport === "tennis" ? "#8ca7a0" : feature.sport === "chess" ? "#ced8b9" : "#91a8b0"} stroke={selectedGeometry.includes(feature.id) ? "#304ffe" : "#e4ead9"} strokeWidth={selectedGeometry.includes(feature.id) ? 5 : 3} />
          <GroundMarkings feature={feature} prefix={prefix} />
        </g>)}
      </g>
    </g>
    {objects.map((object) => object.type === "building" ? <Building key={object.feature.id} feature={object.feature} view={view} active={selectedGeometry.includes(object.feature.id)} /> : <g key={`tree-${object.id}`} transform={`translate(${object.tree.screen[0]},${object.tree.screen[1]})`}>
      <ellipse cx="3" cy="2" rx="8" ry="3.5" fill="#718665" opacity="0.13" />
      {view === "3d" ? <>
        <path d="M0,0v-10" stroke="#9e9f7c" strokeWidth="2" />
        <ellipse cy="-12" rx="6.5" ry="8" fill="#93ac7c" />
        <ellipse cx="-2" cy="-14" rx="4.5" ry="6" fill="#b0c392" />
        <ellipse cx="2" cy="-10" rx="3.5" ry="5" fill="#819e70" opacity="0.7" />
      </> : <><circle r="6.5" fill="#a5bc8c" /><circle cx="-2" cy="-2" r="4" fill="#b6caa0" /></>}
    </g>)}
  </g>;
});
