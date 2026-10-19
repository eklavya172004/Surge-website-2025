"use client";

import { memo, useMemo } from "react";
import rawGeometry from "./campus-geometry.json";
import { CAMPUS_PLACES } from "./places";
import { bounds, buildingLift, centroid, pathData, pointInPolygon, project, type CampusFeature, type MapView, type Point } from "./geometry";

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
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={box.minX + (box.maxX - box.minX) / 9 * i} y={box.minY} width={(box.maxX - box.minX) / 9} height={box.maxY - box.minY} fill={i % 2 ? "#93b956" : "#7fa449"} />)}
      <path d={pathData(feature.points)} fill="none" stroke="#eef1d5" strokeWidth="5" />
      <rect x={center[0] - 5} y={center[1] - 12} width="10" height="24" rx="1" fill="#dec89e" />
      <path d={`M${center[0] - 7},${center[1] - 9}h14 M${center[0] - 7},${center[1] + 9}h14`} stroke="#fff9eb" strokeWidth="1" />
    </g>;
  }
  if (feature.sport === "running") return <g fill="none" stroke="#f0ddd2" strokeWidth="2"><path d={pathData(feature.points)} /><path d={pathData(feature.points)} strokeWidth="7" opacity="0.4" /></g>;
  if (points.length !== 4) return null;
  const [a, b, , d] = points;
  const matrix = `matrix(${(b[0] - a[0]) / 100} ${(b[1] - a[1]) / 100} ${(d[0] - a[0]) / 60} ${(d[1] - a[1]) / 60} ${a[0]} ${a[1]})`;
  return <g transform={matrix} fill="none" stroke="#fffde8" strokeWidth="0.8">
    {feature.sport === "soccer" && Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 10} y="0" width="10" height="60" fill={i % 2 ? "#8cb15e" : "#7da34e"} stroke="none" />)}
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

function Building({ feature, view, active, prefix }: { feature: CampusFeature; view: MapView; active: boolean; prefix: string }) {
  const lift = buildingLift(feature, view);
  const arena = feature.id === "454615138";
  const blue = arena || active;
  const ground = feature.points.map((point) => project(point, view));
  const roof = ground.map(([x, y]): Point => [x, y - lift]);
  const rectangular = roof.length === 5;
  const [a, b, c, d] = roof;
  const roofRibs = arena ? 18 : 8;
  return <g>
    {lift > 0 && <>
      <path d={pathData(ground.map(([x, y]) => [x + lift * 0.65, y + lift * 0.6]))} fill="#526047" opacity="0.19" />
      <path d={pathData(ground)} fill="#4e5c43" opacity="0.13" stroke="#536449" strokeWidth="3" />
    </>}
    {lift > 0 && ground.slice(0, -1).map((point, index) => {
      const next = ground[index + 1];
      const bays = Math.max(1, Math.min(18, Math.floor(Math.hypot(next[0] - point[0], next[1] - point[1]) / (arena ? 8 : 6))));
      return <g key={index}>
        <path d={pathData([point, next, roof[index + 1], roof[index]])} fill={blue ? (next[0] > point[0] ? "#367cae" : "#20577e") : next[0] > point[0] ? "#d6d5c1" : "#b3b8a0"} stroke={blue ? "#265b7c" : "#a6af95"} strokeWidth="0.6" />
        {Array.from({ length: bays }, (_, bay) => {
          const left = interpolate(point, next, (bay + 0.2) / bays), right = interpolate(point, next, (bay + 0.8) / bays);
          return <g key={bay}>
            <path d={pathData([[left[0], left[1] - lift * 0.34], [right[0], right[1] - lift * 0.34], [right[0], right[1] - lift * 0.68], [left[0], left[1] - lift * 0.68]])} fill={blue ? "#b6d8df" : "#718d88"} opacity={blue ? 0.9 : 0.65} />
            {arena && <path d={pathData([[left[0], left[1]], [left[0], left[1] - lift]], false)} stroke="#edf1e9" strokeWidth="1.2" />}
          </g>;
        })}
      </g>;
    })}
    <path d={pathData(roof)} fill={`url(#${prefix}-roof)`} stroke={active ? "#304ffe" : "#aeb8a0"} strokeWidth={active ? 2 : 1} />
    {rectangular && <>
      {Array.from({ length: roofRibs - 1 }, (_, index) => {
        const t = (index + 1) / roofRibs;
        return <path key={index} d={pathData([interpolate(a, b, t), interpolate(d, c, t)], false)} fill="none" stroke={arena ? "#b6c2b8" : "#d2d9c7"} strokeWidth={arena ? 0.8 : 0.6} />;
      })}
      <path d={pathData([interpolate(a, c, 0.04), interpolate(b, d, 0.04), interpolate(c, a, 0.04), interpolate(d, b, 0.04)])} fill="none" stroke="#fffef3" strokeWidth="1.4" />
      {!arena && <path d={pathData([interpolate(a, c, 0.3), interpolate(b, d, 0.3), interpolate(c, a, 0.3), interpolate(d, b, 0.3)])} fill="#dce1d2" stroke="#c0cab4" strokeWidth="0.6" />}
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
    <defs>
      <clipPath id={`${prefix}-campus`}><path d={pathData(CAMPUS_BOUNDARY)} /></clipPath>
      <linearGradient id={`${prefix}-roof`} x1="0" y1="0" x2="0.7" y2="1"><stop stopColor="#fffef6" /><stop offset="0.55" stopColor="#f3f2e5" /><stop offset="1" stopColor="#dde3d5" /></linearGradient>
      <linearGradient id={`${prefix}-water`} x1="0" y1="0" x2="0.7" y2="1"><stop stopColor="#a6d5cf" /><stop offset="1" stopColor="#5398a4" /></linearGradient>
      <radialGradient id={`${prefix}-grass`} cx="35%" cy="35%" r="80%"><stop stopColor="#edf1d3" /><stop offset="1" stopColor="#d3dfb4" /></radialGradient>
      <radialGradient id={`${prefix}-leaves`} cx="28%" cy="22%" r="75%"><stop stopColor="#c0d58b" /><stop offset="0.5" stopColor="#8cab58" /><stop offset="1" stopColor="#557b3f" /></radialGradient>
      <g id={`${prefix}-tree`}>
        <ellipse cx="5" cy="3" rx="10" ry="4.5" fill="#475d32" opacity="0.22" />
        <path d="M0,1v-13" stroke="#8a7652" strokeWidth="2.3" />
        <path d="M0,-6l-4,-4 M0,-5l4,-5" fill="none" stroke="#8a7652" strokeWidth="1" />
        <path d="M-6,-7C-12,-9 -10,-17 -6,-19C-7,-26 2,-27 5,-22C12,-23 14,-14 9,-11C10,-5 2,-3 -1,-6C-3,-4 -6,-5 -6,-7Z" fill={`url(#${prefix}-leaves)`} />
        <ellipse cx="-3" cy="-18" rx="4" ry="5" fill="#d1dfa1" opacity="0.35" />
        <ellipse cx="5" cy="-10" rx="4.5" ry="3.5" fill="#426e39" opacity="0.25" />
      </g>
    </defs>
    {view === "3d" && <path d={pathData(CAMPUS_BOUNDARY.map((point) => { const p = project(point, view); return [p[0] + 3, p[1] + 12]; }))} fill="#b8c79c" stroke="#a7b88c" strokeWidth="1" />}
    <g transform={matrix}>
      <path d={pathData(CAMPUS_BOUNDARY)} fill={`url(#${prefix}-grass)`} stroke="#becda3" strokeWidth="2" />
      <g clipPath={`url(#${prefix}-campus)`}>
        {features.filter((feature) => feature.kind === "green" || feature.kind === "parking").map((feature) => <path key={feature.id} d={pathData(feature.points)} fill={feature.kind === "parking" ? "#c7cebb" : SPORT_GROUND_IDS.has(feature.id) ? "#91b35e" : "#c4d6a3"} stroke={selectedGeometry.includes(feature.id) ? "#304ffe" : "#bccd9a"} strokeWidth={selectedGeometry.includes(feature.id) ? 5 : 1} />)}
        {features.filter((feature) => feature.kind === "water").map((feature) => <g key={feature.id}><path d={pathData(feature.points)} fill={`url(#${prefix}-water)`} stroke="#e0d8b8" strokeWidth="10" /><path d={pathData(feature.points)} fill="none" stroke="#d2e6cf" strokeWidth="2" /></g>)}
        {features.filter((feature) => feature.kind === "road" || feature.kind === "path").map((feature) => <g key={feature.id} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={pathData(feature.points, false)} stroke={feature.kind === "road" ? "#eeeedd" : "#bfcbab"} strokeWidth={feature.kind === "road" ? 12 : 4} />
          <path d={pathData(feature.points, false)} stroke={feature.kind === "road" ? "#a3ab9f" : "#f9f6e6"} strokeWidth={feature.kind === "road" ? 8 : 2.5} />
          {feature.kind === "road" && <path d={pathData(feature.points, false)} stroke="#f4f1dd" strokeWidth="0.65" strokeDasharray="4 5" />}
        </g>)}
        {features.filter((feature) => feature.kind === "sport").map((feature) => <g key={feature.id}>
          <path d={pathData(feature.points)} fill={feature.sport === "soccer" || feature.sport === "cricket" ? "#87aa52" : feature.sport === "running" ? "#b77e63" : feature.sport === "tennis" ? "#508a80" : feature.sport === "chess" ? "#c1ce9f" : feature.sport === "basketball" ? "#c18a63" : "#5b9197"} stroke={selectedGeometry.includes(feature.id) ? "#304ffe" : "#f6f3df"} strokeWidth={selectedGeometry.includes(feature.id) ? 5 : 3} />
          <GroundMarkings feature={feature} prefix={prefix} />
        </g>)}
      </g>
    </g>
    {objects.map((object) => object.type === "building" ? <Building key={object.feature.id} feature={object.feature} view={view} active={selectedGeometry.includes(object.feature.id)} prefix={prefix} /> : <g key={`tree-${object.id}`} transform={`translate(${object.tree.screen[0]},${object.tree.screen[1]}) scale(${0.83 + (Math.sin(object.tree.point[0] + object.tree.point[1]) + 1) * 0.16})`}>
      {view === "3d" ? <use href={`#${prefix}-tree`} /> : <><ellipse cx="2" cy="2" rx="8" ry="7" fill="#557b3f" opacity="0.2" /><circle r="7" fill={`url(#${prefix}-leaves)`} /><circle cx="-2" cy="-2" r="4" fill="#b8ce83" opacity="0.6" /></>}
    </g>)}
  </g>;
});
