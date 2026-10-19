"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, Crosshair, Expand, Layers3, LocateFixed, Minus, Navigation2, Plus, RotateCcw, Shrink, X } from "lucide-react";
import { CAMPUS_PLACES, type CampusPlace } from "./places";
import { bounds, buildingLift, centroid, directionsUrl, distanceToPolygon, pointInPolygon, project, toWorld, unproject, type MapView, type Point } from "./geometry";
import { CAMPUS_BOUNDARY, CAMPUS_FEATURES, CampusArtwork } from "./CampusArtwork";
import styles from "../../styles/Map.module.css";

type Camera = { center: Point | null; zoom: number };
type Gesture = { center: Point; zoom: number; point: Point; distance: number };
type LocationStatus = "idle" | "locating" | "active" | "outside" | "denied" | "unavailable" | "error";
type Marker = { place: CampusPlace; point: Point };
type Cluster = { items: Marker[]; point: Point };
type Props = { places: CampusPlace[]; selected: CampusPlace | null; selectPlace: (place: CampusPlace) => void; expanded: boolean; toggleExpanded: () => void; resetToken: number; focusToken: number };
const EMPTY_GEOMETRY: string[] = [];
const MIN_ZOOM = 1, MAX_ZOOM = 8;
const VENUE_BOUNDS = bounds(CAMPUS_PLACES.filter((place) => place.category !== "essentials").map((place) => project(toWorld(place.longitude, place.latitude), "3d")));
const VENUE_CENTER = unproject([(VENUE_BOUNDS.minX + VENUE_BOUNDS.maxX) / 2, (VENUE_BOUNDS.minY + VENUE_BOUNDS.maxY) / 2], "3d");

export default function CampusCanvas({ places, selected, selectPlace, expanded, toggleExpanded, resetToken, focusToken }: Props) {
  const [view, setView] = useState<MapView>("3d");
  const [camera, setCamera] = useState<Camera>({ center: VENUE_CENTER, zoom: 1.5 });
  const [size, setSize] = useState({ width: 800, height: 620 });
  const [dragging, setDragging] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [userLocation, setUserLocation] = useState<{ point: Point; accuracy: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<number | null>(null);
  const locatedRef = useRef(false);
  const pointersRef = useRef(new globalThis.Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const lastReset = useRef(resetToken), lastFocus = useRef(focusToken);
  const projectedBounds = useMemo(() => bounds(CAMPUS_BOUNDARY.map((point) => project(point, view))), [view]);
  const fitScale = Math.max(0.01, Math.min((size.width - 64) / (projectedBounds.maxX - projectedBounds.minX), (size.height - 92) / (projectedBounds.maxY - projectedBounds.minY)));
  const center = useMemo<Point>(() => camera.center ? project(camera.center, view) : [(projectedBounds.minX + projectedBounds.maxX) / 2, (projectedBounds.minY + projectedBounds.maxY) / 2], [camera.center, projectedBounds, view]);
  const scale = fitScale * camera.zoom;

  // Tokens distinguish an explicit selection/reset from an initial render.
  useEffect(() => {
    if (lastReset.current === resetToken) return;
    lastReset.current = resetToken;
    if (places.length && places.length < CAMPUS_PLACES.length) {
      const box = bounds(places.map((place) => project(toWorld(place.longitude, place.latitude), view)));
      const zoom = Math.max(1, Math.min(3.2, Math.min((size.width - 110) / (box.maxX - box.minX + 150), (size.height - 150) / (box.maxY - box.minY + 150)) / fitScale));
      setCamera({ center: unproject([(box.minX + box.maxX) / 2, (box.minY + box.maxY) / 2], view), zoom });
    } else setCamera({ center: null, zoom: 1 });
  }, [resetToken, places, view, size.width, size.height, fitScale]);
  useEffect(() => {
    if (lastFocus.current === focusToken) return;
    lastFocus.current = focusToken;
    if (selected) setCamera((current) => ({ center: toWorld(selected.longitude, selected.latitude), zoom: Math.max(2.7, current.zoom) }));
  }, [focusToken, selected]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => { if (watchRef.current !== null) navigator.geolocation?.clearWatch(watchRef.current); }, []);

  const setProjectedCamera = useCallback((point: Point, zoom: number) => {
    const clamped: Point = [Math.max(projectedBounds.minX - 180, Math.min(projectedBounds.maxX + 180, point[0])), Math.max(projectedBounds.minY - 180, Math.min(projectedBounds.maxY + 180, point[1]))];
    setCamera({ center: unproject(clamped, view), zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) });
  }, [projectedBounds, view]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey && !expanded) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const point: Point = [event.clientX - rect.left - size.width / 2, event.clientY - rect.top - size.height / 2 - 8];
      const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.zoom * Math.exp(-event.deltaY * 0.008)));
      setProjectedCamera([center[0] + point[0] / scale - point[0] / (fitScale * zoom), center[1] + point[1] / scale - point[1] / (fitScale * zoom)], zoom);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [camera.zoom, center, expanded, fitScale, scale, setProjectedCamera, size.width, size.height]);

  function seedGesture() {
    const points = [...pointersRef.current.values()];
    if (!points.length) { gestureRef.current = null; setDragging(false); return; }
    gestureRef.current = { center, zoom: camera.zoom, point: points.length > 1 ? [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2] : points[0], distance: points.length > 1 ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) : 0 };
  }
  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("button, a") || (event.pointerType === "mouse" && event.button !== 0)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointersRef.current.set(event.pointerId, [event.clientX - rect.left, event.clientY - rect.top]);
    event.currentTarget.setPointerCapture(event.pointerId); seedGesture(); setDragging(true);
  }
  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId) || !gestureRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointersRef.current.set(event.pointerId, [event.clientX - rect.left, event.clientY - rect.top]);
    const points = [...pointersRef.current.values()], initial = gestureRef.current;
    if (points.length > 1 && initial.distance > 0) {
      const midpoint: Point = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
      const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initial.zoom * Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) / initial.distance));
      setProjectedCamera([initial.center[0] + (initial.point[0] - size.width / 2) / (fitScale * initial.zoom) - (midpoint[0] - size.width / 2) / (fitScale * zoom), initial.center[1] + (initial.point[1] - size.height / 2 - 8) / (fitScale * initial.zoom) - (midpoint[1] - size.height / 2 - 8) / (fitScale * zoom)], zoom);
    } else setProjectedCamera([initial.center[0] - (points[0][0] - initial.point[0]) / (fitScale * initial.zoom), initial.center[1] - (points[0][1] - initial.point[1]) / (fitScale * initial.zoom)], initial.zoom);
  }
  function endPointer(event: ReactPointerEvent<HTMLDivElement>) { pointersRef.current.delete(event.pointerId); seedGesture(); }

  function locateUser() {
    if (watchRef.current !== null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null; setUserLocation(null); setLocationStatus("idle"); return; }
    if (!navigator.geolocation || !window.isSecureContext) { setLocationStatus("unavailable"); return; }
    setLocationStatus("locating"); locatedRef.current = false;
    watchRef.current = navigator.geolocation.watchPosition((position) => {
      const point = toWorld(position.coords.longitude, position.coords.latitude);
      // Fence data and GPS both have uncertainty, especially at the entry gate.
      if (!pointInPolygon(point, CAMPUS_BOUNDARY) && distanceToPolygon(point, CAMPUS_BOUNDARY) > Math.max(35, Math.min(position.coords.accuracy, 80))) {
        setLocationStatus("outside"); setUserLocation(null);
        if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null; return;
      }
      setUserLocation({ point, accuracy: position.coords.accuracy }); setLocationStatus("active");
      if (!locatedRef.current) { setCamera({ center: point, zoom: 3 }); locatedRef.current = true; }
    }, (error) => {
      setLocationStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error"); setUserLocation(null);
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  }

  const clusters = useMemo(() => {
    const markers: Marker[] = places.map((place) => {
      const point = project(toWorld(place.longitude, place.latitude), view);
      const building = CAMPUS_FEATURES.find((feature) => feature.kind === "building" && place.geometryIds.includes(feature.id));
      const lift = building ? buildingLift(building, view) : 0;
      return { place, point: [size.width / 2 + (point[0] - center[0]) * scale, size.height / 2 + 8 + (point[1] - center[1] - lift) * scale] as Point };
    });
    const groups: Cluster[] = [];
    for (const marker of markers) {
      const group = marker.place.id === selected?.id ? undefined : groups.find((item) => item.items.every((entry) => entry.place.id !== selected?.id && Math.hypot(entry.point[0] - marker.point[0], entry.point[1] - marker.point[1]) < 43));
      if (group) { group.items.push(marker); group.point = centroid(group.items.map((item) => item.point)); }
      else groups.push({ items: [marker], point: marker.point });
    }
    return groups.filter((group) => group.point[0] > -20 && group.point[0] < size.width + 20 && group.point[1] > 20 && group.point[1] < size.height + 30);
  }, [places, selected?.id, view, size.width, size.height, center, scale]);
  const locationMessage = locationStatus === "locating" ? "Finding your location…" : locationStatus === "active" ? `Location on · accurate to about ${Math.round(userLocation?.accuracy ?? 0)} m` : locationStatus === "outside" ? "You’re outside campus. Arrive through Gate 1." : locationStatus === "denied" ? "Location permission is off. You can still explore every place." : locationStatus === "unavailable" ? "Location isn’t available in this browser. Search for a place instead." : locationStatus === "error" ? "Couldn’t find your location. Try again outdoors." : "";
  const userProjected = userLocation ? project(userLocation.point, view) : null;
  const planeX = project([1, 0], view), planeY = project([0, 1], view);

  return <div ref={viewportRef} className={`${styles.viewport} ${dragging ? styles.dragging : ""}`} role="region" aria-label="Interactive campus map" tabIndex={0} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={endPointer} onPointerCancel={endPointer} onLostPointerCapture={endPointer} onKeyDown={(event) => {
    if (event.target !== event.currentTarget) return;
    const move = 80 / scale;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft") setProjectedCamera([center[0] - move, center[1]], camera.zoom);
    if (event.key === "ArrowRight") setProjectedCamera([center[0] + move, center[1]], camera.zoom);
    if (event.key === "ArrowUp") setProjectedCamera([center[0], center[1] - move], camera.zoom);
    if (event.key === "ArrowDown") setProjectedCamera([center[0], center[1] + move], camera.zoom);
    if (event.key === "+" || event.key === "=") setProjectedCamera(center, camera.zoom * 1.4);
    if (event.key === "-") setProjectedCamera(center, camera.zoom / 1.4);
    if (event.key === "Home") setCamera({ center: null, zoom: 1 });
  }}>
    <svg className={styles.artwork} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true" focusable="false">
      <g transform={`translate(${size.width / 2},${size.height / 2 + 8}) scale(${scale}) translate(${-center[0]},${-center[1]})`}>
        <CampusArtwork view={view} selectedGeometry={selected?.geometryIds ?? EMPTY_GEOMETRY} prefix="main" />
        {userLocation && <g transform={`matrix(${planeX[0]} ${planeX[1]} ${planeY[0]} ${planeY[1]} 0 0)`}><circle cx={userLocation.point[0]} cy={userLocation.point[1]} r={userLocation.accuracy} fill="#304ffe" fillOpacity="0.12" stroke="#304ffe" strokeOpacity="0.35" strokeWidth={1 / scale} /></g>}
      </g>
      {userProjected && <g transform={`translate(${size.width / 2 + (userProjected[0] - center[0]) * scale},${size.height / 2 + 8 + (userProjected[1] - center[1]) * scale})`}><circle r="10" fill="white" /><circle r="6.5" fill="#304ffe" /><circle r="10" fill="none" stroke="#304ffe" strokeWidth="1" opacity="0.3" /></g>}
    </svg>
    <div className={styles.mapWordmark} aria-hidden="true">SNU<span>CAMPUS</span></div>
    <div className={styles.compass} aria-label="North"><Navigation2 size={24} strokeWidth={1.4} style={{ transform: view === "3d" ? "rotate(-54deg)" : "none" }} /><span>N</span></div>
    {clusters.map((cluster) => {
      if (cluster.items.length > 1) return <button type="button" key={cluster.items.map((item) => item.place.id).join("-")} className={styles.cluster} style={{ left: cluster.point[0], top: cluster.point[1] }} aria-label={`Zoom in to ${cluster.items.length} places: ${cluster.items.map((item) => item.place.shortName).join(", ")}`} onClick={() => setProjectedCamera([center[0] + (cluster.point[0] - size.width / 2) / scale, center[1] + (cluster.point[1] - size.height / 2 - 8) / scale], Math.min(MAX_ZOOM, camera.zoom * 2))}><span>{cluster.items.length}</span><Plus size={10} aria-hidden="true" /></button>;
      const place = cluster.items[0].place;
      return <button type="button" key={place.id} className={`${styles.pin} ${styles[place.category]} ${selected?.id === place.id ? styles.pinSelected : ""}`} style={{ left: cluster.point[0], top: cluster.point[1] }} aria-label={`Show ${place.name}`} aria-pressed={selected?.id === place.id} onClick={() => selectPlace(place)}><span className={styles.pinHead}>{place.mapNumber}</span><span className={styles.pinStem} /><span className={styles.pinLabel}>{place.shortName}</span></button>;
    })}
    <div className={styles.viewControl} role="group" aria-label="Map perspective"><Layers3 size={15} aria-hidden="true" /><button type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")}>3D</button><button type="button" aria-pressed={view === "2d"} onClick={() => setView("2d")}>2D</button></div>
    <div className={styles.mapControls}>
      <button type="button" aria-label={locationStatus === "active" ? "Turn off current location" : "Show my current location"} aria-pressed={locationStatus === "active"} className={locationStatus === "active" || locationStatus === "locating" ? styles.controlActive : ""} onClick={locateUser}>{locationStatus === "active" ? <LocateFixed size={19} /> : <Crosshair size={19} />}</button>
      <div className={styles.zoomControls}><button type="button" aria-label="Zoom in" disabled={camera.zoom >= MAX_ZOOM} onClick={() => setProjectedCamera(center, camera.zoom * 1.4)}><Plus size={19} /></button><button type="button" aria-label="Zoom out" disabled={camera.zoom <= MIN_ZOOM} onClick={() => setProjectedCamera(center, camera.zoom / 1.4)}><Minus size={19} /></button></div>
      <button type="button" aria-label="Reset campus overview" onClick={() => setCamera({ center: null, zoom: 1 })}><RotateCcw size={17} /></button>
      <button type="button" aria-label={expanded ? "Close expanded map" : "Expand map"} aria-expanded={expanded} onClick={toggleExpanded}>{expanded ? <Shrink size={18} /> : <Expand size={18} />}</button>
    </div>
    {locationMessage && <div className={styles.locationMessage} role="status"><span>{locationMessage}</span>{locationStatus === "outside" && <a href={directionsUrl(CAMPUS_PLACES.find((place) => place.id === "gate1")!)} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight size={13} /></a>}{!["active", "locating"].includes(locationStatus) && <button type="button" aria-label="Dismiss location message" onClick={() => setLocationStatus("idle")}><X size={14} /></button>}</div>}
    <div className={styles.mapFooter}><span className={styles.gestureHint}>Drag to explore · pinch to zoom</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></div>
  </div>;
}
