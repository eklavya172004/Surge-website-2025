"use client";

import { trpc } from "@/utils/trpc";
import styles from "../styles/SportsGrid.module.css";
import Link from "next/link";
import Image from "next/image";

export default function AllEventsGrid() {
  const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div className="p-8">Loading events…</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!events || events.length === 0) return <div className="p-8">No events found.</div>;

  // Split into main grid (first 8 events) and the big "MORE" card
  const mainEvents = events.slice(0, 8);
  const hasMore = events.length > 8;

  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        {/* Left side heading */}
        <div className={styles.stay_updated}>
          ALL<br />EVENTS
        </div>

        {/* Right side grid */}
        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            <div className={styles.Images}>
              {mainEvents.map((ev) => (
                <Link
                  href={`/events/${ev.slug}`}
                  key={ev.id}
                  className={styles.image_wrapper}
                >
                  {ev.eventImg && (
                    <Image
                      src={ev.eventImg}
                      alt={ev.name}
                      width={400}
                      height={400}
                    />
                  )}
                  <img
                    src="/sports/gradient.png"
                    className={styles.gradient}
                    alt=""
                  />
                  <div className={styles.overlay_text_small}>{ev.name}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* More card on the right */}
          <div className={styles.column2}>
            <div className={styles.image_wrapper}>
              <Link href="/events">
                <Image
                  src="/sports/more.png"
                  alt="More events"
                  width={400}
                  height={400}
                />
                <div className={styles.overlay_text}>
                  {hasMore ? "MORE" : "EVENTS"}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}