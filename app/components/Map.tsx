"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, DoorOpen, MapPin, Search, X } from "lucide-react";
import { CAMPUS_PLACES, CATEGORY_LABELS, type CampusPlace, type PlaceCategory } from "./campus-map/places";
import { directionsUrl, project, searchPlaces, toWorld } from "./campus-map/geometry";
import { CampusArtwork } from "./campus-map/CampusArtwork";
import CampusCanvas from "./campus-map/CampusCanvas";
import PlaceIcon from "./campus-map/PlaceIcon";
import styles from "../styles/Map.module.css";

const FILTERS: { id: PlaceCategory | "all"; label: string }[] = [{ id: "all", label: "All places" }, { id: "sports", label: "Sports" }, { id: "food", label: "Food & dining" }, { id: "essentials", label: "Essentials" }];
const GATE = CAMPUS_PLACES.find((place) => place.id === "gate1")!;

function VenuePreview({ place }: { place: CampusPlace }) {
  const world = useMemo(() => toWorld(place.longitude, place.latitude), [place]);
  const center = project(world, "3d");
  return <div className={styles.venuePreview} aria-hidden="true">
    <svg viewBox={`${center[0] - 130} ${center[1] - 100} 260 165`} focusable="false"><CampusArtwork view="3d" selectedGeometry={place.geometryIds} prefix={`preview-${place.id}`} focus={world} /></svg>
    <span className={styles.previewCaption}>SNU CAMPUS</span>
  </div>;
}

export default function Map() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>("isc");
  const [expanded, setExpanded] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [focusToken, setFocusToken] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);
  const places = useMemo(() => searchPlaces(CAMPUS_PLACES, query, category), [query, category]);
  const selected = CAMPUS_PLACES.find((place) => place.id === selectedId) ?? null;

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    explorerRef.current?.querySelector<HTMLButtonElement>('[aria-label="Close expanded map"]')?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key !== "Tab") return;
      const targets = [...(explorerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex="0"]') ?? [])].filter((element) => element.getClientRects().length > 0);
      const first = targets[0], last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", escape); previousFocus?.focus(); };
  }, [expanded]);

  const selectPlace = (place: CampusPlace) => { setSelectedId(place.id); setFocusToken((value) => value + 1); };
  const resetOverview = () => { setSelectedId(null); setResetToken((value) => value + 1); };

  return <section id="event-map" className={styles.section} aria-labelledby="event-map-heading">
    <div className={styles.headingRow}>
      <div><p className={styles.eyebrow}><span /> SURGE ’26 / CAMPUS GUIDE</p><h2 id="event-map-heading">EVENT MAP<span>.</span></h2></div>
      <p className={styles.intro}>Find your arena.<br /><span>And everything in between.</span></p>
    </div>
    <div ref={explorerRef} className={`${styles.explorer} ${expanded ? styles.expanded : ""}`} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Campus map explorer" : undefined}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} aria-hidden="true" />
          <input ref={searchRef} aria-label="Search campus places" placeholder="Search courts, DH1, coffee…" value={query} onChange={(event) => { setQuery(event.target.value); resetOverview(); }} />
          {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); resetOverview(); searchRef.current?.focus(); }}><X size={16} /></button>}
        </div>
        <div className={styles.filters} role="group" aria-label="Filter campus places">
          {FILTERS.map((filter) => <button type="button" key={filter.id} aria-pressed={category === filter.id} className={category === filter.id ? styles.filterActive : ""} onClick={() => { setCategory(filter.id); resetOverview(); }}>{filter.label}</button>)}
        </div>
      </div>
      <div className={styles.workspace}>
        <CampusCanvas places={places} selected={selected} selectPlace={selectPlace} expanded={expanded} toggleExpanded={() => setExpanded(!expanded)} resetToken={resetToken} focusToken={focusToken} />
        <aside className={styles.sidebar} aria-label="Campus places">
          {selected ? <div className={styles.detail}>
            <div className={styles.detailTop}><button type="button" className={styles.backButton} onClick={() => setSelectedId(null)}><ArrowLeft size={15} /> All places</button><span className={`${styles.categoryLabel} ${styles[selected.category]}`}><PlaceIcon place={selected} size={12} />{CATEGORY_LABELS[selected.category]}</span></div>
            <VenuePreview place={selected} />
            <div className={styles.detailBody} aria-live="polite" aria-atomic="true">
              <p className={styles.detailEyebrow}>YOUR NEXT STOP</p><h3>{selected.name}</h3><p className={styles.description}>{selected.description}</p>
              <div className={styles.tags}>{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a className={styles.directionsButton} href={directionsUrl(selected)} target="_blank" rel="noopener noreferrer"><span>Get directions</span><ArrowUpRight size={19} /></a>
              <a className={styles.mapsLink} href={selected.mapsUrl} target="_blank" rel="noopener noreferrer">View on Google Maps <ArrowUpRight size={13} /></a>
            </div>
            <div className={styles.entryNote}><DoorOpen size={17} /><div>Coming to SURGE?<a href={directionsUrl(GATE)} target="_blank" rel="noopener noreferrer">Enter through Gate 1 <ArrowUpRight size={12} /></a></div></div>
          </div> : <div className={styles.results}>
            <div className={styles.resultsHeading}><div><p className={styles.detailEyebrow}>{query ? "SEARCH RESULTS" : "EXPLORE CAMPUS"}</p><h3>{query ? "Find your place" : category === "all" ? "Pick your next stop" : category === "food" ? "Refuel here" : category === "sports" ? "Find your arena" : "Start here"}</h3></div><span aria-live="polite">{places.length}</span></div>
            <div className={styles.placeList}>
              {places.map((place) => <button type="button" key={place.id} className={styles.placeRow} onClick={() => selectPlace(place)}><span className={`${styles.placeRowIcon} ${styles[place.category]}`}><PlaceIcon place={place} /></span><span><strong>{category === "food" && place.id === "football-futsal" ? "Futsal Field Food Stalls" : place.name}</strong><small>{category === "food" && place.id === "football-futsal" ? "Food stalls · Shared football / futsal ground" : place.tags.slice(0, 2).join(" · ")}</small></span><ChevronRight size={16} aria-hidden="true" /></button>)}
              {!places.length && <div className={styles.emptyState}><Search size={28} /><h4>No places found</h4><p>Try “DH2”, “volleyball” or “coffee”.</p><button type="button" onClick={() => { setQuery(""); setCategory("all"); searchRef.current?.focus(); }}>Clear search & filters</button></div>}
            </div>
          </div>}
        </aside>
      </div>
      <div className={styles.legendRow}><div><span><i className={styles.sports} />Sports</span><span><i className={styles.food} />Food & dining</span><span><i className={styles.essentials} />Essentials</span></div><span className={styles.legendHint}><MapPin size={13} /> Tap a place to explore</span></div>
    </div>
    <div className={styles.sectionFootnote}><span><Check size={14} /> Your campus, a little closer.</span><a href={directionsUrl(GATE)} target="_blank" rel="noopener noreferrer">Getting to SURGE <ArrowUpRight size={14} /></a></div>
  </section>;
}
