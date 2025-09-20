"use client";

import { trpc } from "@/utils/trpc";
import styles from "../styles/AllEvents.module.css";
import Link from "next/link";
import type { EventSummary } from "@/types/eventTypes";

export default function AllEventsGrid() {
  const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

  if (isLoading)
    return (
      <section className={styles.image_grid}>
        <div className={styles.grid}>
          <div className={styles.stay_updated}>ALL<br />EVENTS</div>
          <div className={styles.sports_grid}>
            <div className={styles.column1}>
              <div className={styles.Images}>
                <div className={styles.image_wrapper}>Loading events…</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  if (error)
    return (
      <section className={styles.image_grid}>
        <div className={styles.grid}>
          <div className={styles.stay_updated}>ALL<br />EVENTS</div>
          <div className={styles.sports_grid}>
            <div className={styles.column1}>
              <div className={styles.Images}>
                <div className={styles.image_wrapper}>Error: {error.message}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  if (!events || events.length === 0)
    return (
      <section className={styles.image_grid}>
        <div className={styles.grid}>
          <div className={styles.stay_updated}>ALL<br />EVENTS</div>
          <div className={styles.sports_grid}>
            <div className={styles.column1}>
              <div className={styles.Images}>
                <div className={styles.image_wrapper}>No events found.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        {/* Left heading */}
        <div className={styles.stay_updated}>
          ALL<br />EVENTS
        </div>

        {/* Right side grid: show all events (rows of 5) */}
        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            <div className={styles.Images}>
              {events.map((ev: EventSummary) => (
                <div className={styles.image_wrapper} key={ev.id}>
                  {ev.eventImg ? (
                    <img
                      src={ev.eventImg}
                      alt={ev.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <img
                      src="/sports/gradient.png"
                      alt={ev.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )}

                  <img src="/sports/gradient.png" className={styles.gradient} alt="" />

                  <div className={styles.overlay_text_small}>{ev.name}</div>

                  <Link href={`/dashboard/events/${ev.slug}`}>
                    <span
                      style={{ position: "absolute", inset: 0, zIndex: 3, display: "block" }}
                      aria-hidden="false"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
