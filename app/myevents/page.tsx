// components/MyEventsClient.tsx
"use client";

import React from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import Image from "next/image";

export default function MyEventsClient() {
  const { data: teams, isLoading, error } = trpc.event.getMyEvents.useQuery();

  if (isLoading) return <div>Loading your events...</div>;
  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  if (!teams || teams.length === 0) {
    return <div>You have no registered teams/events.</div>;
  }

  return (
    <div className="space-y-4">
      {teams.map((team:any) => (
        <div key={team.id} className="border rounded p-4 shadow-sm">
          <div className="flex gap-4">
            <div className="w-28 h-20 relative bg-gray-100">
              {team.Event?.eventImg ? (
                <Image src={team.Event.eventImg} alt={team.Event.name} fill style={{ objectFit: "cover" }} />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-500">No image</div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                <Link href={`/events/${team.Event.slug}`}>{team.Event.name}</Link>
              </h3>
              <p className="text-sm text-gray-600">{team.Event.venue}</p>
              <p className="text-sm text-gray-700 mt-2">
                Players: {team.TeamMembers?.length ?? 0} • Price per player: ₹{team.Event.pricePerPlayer ?? "—"}
              </p>

              <div className="mt-3 text-sm">
                <strong>Team Members</strong>
                <ul className="mt-1 list-disc ml-5">
                  {team.TeamMembers.map((m:any) => (
                    <li key={m.id}>
                      {m.name} ({m.rollNumber}) — {m.phone} {m.isVerified === "VERIFIED" ? "✅" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-gray-500">Team ID: {team.id}</span>
              {team.paymentDetailsId ? (
                <span className="text-xs px-2 py-1 bg-green-100 rounded-full">Paid</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-yellow-100 rounded-full">Pending</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
