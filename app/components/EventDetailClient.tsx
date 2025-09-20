"use client";

import React, { useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";
import styles from "../styles/EventDetail.module.css";
import Link from "next/link";
import type { EventSummary } from "@/types/eventTypes";

type Props = {
  slug: string;
};

type CartItem = {
  eventId: string;
  slug: string;
  players: number;
  accommodation: boolean;
  accommodationDetails?: {
    maleCount: number;
    femaleCount: number;
    startDate?: string;
    endDate?: string;
  };
};

function formatDate(d?: string | Date | null) {
  if (!d) return "TBA";
  if (typeof d === "string") return d;
  try {
    return d.toLocaleDateString();
  } catch {
    return String(d);
  }
}

export default function EventDetailClient({ slug }: Props) {
  const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

  // compute event from query result to avoid needing a nullable state
  const event = useMemo(
    () => (events ? events.find((e) => e.slug === slug) ?? null : null),
    [events, slug]
  );

  const [players, setPlayers] = useState<number>(1);
  const [accommodation, setAccommodation] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // While loading or on error show early UI
  if (isLoading) return <div className={styles.container}>Loading event…</div>;
  if (error) return <div className={styles.container}>Error: {error.message}</div>;
  if (!event) return <div className={styles.container}>Event not found.</div>;

  // At this point `event` is definitely non-null (TypeScript knows it)
  const minPlayers = event.minPlayers ?? 1;
  const maxPlayers = event.maxPlayers ?? 1;

  // ensure players default respects minPlayers
  React.useEffect(() => {
    setPlayers((p) => Math.max(minPlayers, p));
    // we intentionally only update when minPlayers changes
  }, [minPlayers]);

  function addToCart() {
    if (!event) {
      setMessage("Event not available.");
      return;
    }

    if (players < minPlayers || players > maxPlayers) {
      setMessage(`Players must be between ${minPlayers} and ${maxPlayers}.`);
      return;
    }

    const item: CartItem = {
      eventId: event.id,
      slug: event.slug,
      players,
      accommodation,
    };

    try {
      const raw = localStorage.getItem("eventCart");
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      cart.push(item);
      localStorage.setItem("eventCart", JSON.stringify(cart));
      setMessage("Added to cart — open your cart to proceed to payment.");
    } catch (e) {
      console.error(e);
      setMessage("Could not add to cart (localStorage error).");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{event.name}</h1>
        <div className={styles.venue}>
          {event.venue} • {formatDate(event.dateFrom)} - {formatDate(event.dateTo)}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.left}>
          {event.eventImg ? (
            <img src={event.eventImg} alt={event.name} className={styles.event_img} />
          ) : (
            <div className={styles.no_img}>No image</div>
          )}

          <div className={styles.about}>
            This is the event about section
            {/* <h3>About</h3>
            <p>{event.about ?? "No details provided."}</p>

            <h4>Rules</h4>
            <p>{event.rules ?? "No rules provided."}</p> */}

            <div className={styles.meta_row}>
              <div>
                <strong>Players</strong>: {minPlayers} - {maxPlayers}
              </div>
              <div>
                <strong>Price per player</strong>: ₹{event.pricePerPlayer ?? "—"}
              </div>
              <div>
                <strong>Category</strong>: {event.category}
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.right}>
          <div className={styles.card}>
            <h3>Register / Add to cart</h3>

            <label className={styles.label}>Players</label>
            <input
              type="number"
              min={minPlayers}
              max={maxPlayers}
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className={styles.input}
            />
            <div className={styles.help}>
              Select number of players ({minPlayers} - {maxPlayers})
            </div>

            <label className={styles.label}>
              <input
                type="checkbox"
                checked={accommodation}
                onChange={(e) => setAccommodation(e.target.checked)}
              />{" "}
              Need accommodation
            </label>

            <div style={{ marginTop: 12 }}>
              <button className={styles.button} onClick={addToCart}>
                Add to cart
              </button>
              <Link href="/cart">
                <button className={styles.button_secondary} style={{ marginLeft: 8 }}>
                  Open cart
                </button>
              </Link>
            </div>

            {message && <div className={styles.message}>{message}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
