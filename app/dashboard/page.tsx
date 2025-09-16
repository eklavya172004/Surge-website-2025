"use client";

import React from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import Image from "next/image";

export default function AllEventsClient() {
  const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div>Loading all events...</div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="border rounded-lg shadow hover:shadow-md transition bg-white overflow-hidden"
        >
          <div className="h-40 w-full relative">
            {event.eventImg ? (
              <Image
                src={event.eventImg}
                alt={event.name}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No image
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold">
              <Link href={`/events/${event.slug}`}>{event.name}</Link>
            </h3>
            <p className="text-sm text-gray-600">{event.venue}</p>
            <p className="text-xs text-gray-500">
              {new Date(event.dateFrom).toLocaleDateString()} -{" "}
              {new Date(event.dateTo).toLocaleDateString()}
            </p>

            <div className="mt-3 text-sm">
              <span className="block">
                Category: <strong>{event.category}</strong>
              </span>
              <span className="block">
                Players: {event.minPlayers} – {event.maxPlayers}
              </span>
              <span className="block">
                Price per player: ₹{event.pricePerPlayer ?? "—"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
