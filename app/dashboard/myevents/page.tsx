"use client";
import React from "react";
import { trpc } from "@/utils/trpc";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
  isVerified: "VERIFIED" | "UNVERIFIED";
  teamId: string;
}

interface Event {
  id: string;
  name: string;
  eventImg?: string | null;
  venue?: string | null;
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  category: string;
  about?: string | null;
  rules?: string | null;
  minPlayers: number;
  maxPlayers: number;
  pricePerPlayer?: number | null;
  isVerified?: boolean;
  slug: string;
}

interface EventSummary {
  id: string;
  name: string;
  eventImg?: string | null;
  venue?: string | null;
  pricePerPlayer?: number | null;
}

export default function MyEventsClient() {
  const { data: teams, isLoading, error } = trpc.event.getMyEvents.useQuery();
  const { data: allEvents } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div style={{ padding: "20px", textAlign: "center" }}>Loading your events...</div>;
  if (error) return <div style={{ padding: "20px", textAlign: "center", color: "red" }}>Error: {error.message}</div>;

  const suggestedEvents: EventSummary[] = (allEvents ?? []).slice(0, 5);

  return (
    <section style={{ background: "white", margin: 0, padding: "28px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", alignItems: "flex-start" }}>
        <div style={{ marginTop: "6%", fontFamily: "'Anton', sans-serif", backgroundColor: "white", fontSize: "10rem", color: "black", marginBottom: "20px", lineHeight: 1, letterSpacing: "4px", width: "260px", textAlign: "left" }}>
          YOUR<br/>EVENTS
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "20px", padding: "10px 0", flex: 1, width: "100%", height: "auto" }}>
          <div style={{ flex: 1, width: "auto", height: "auto" }}>
            {/* If user has teams, show them in cards. Otherwise show message and suggested events */}
            {teams && teams.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {teams.map((team) => (
                  <div key={team.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "100px", height: "80px", overflow: "hidden", flexShrink: 0 }}>
                        {team.Event?.eventImg ? (
                          <Image src={team.Event.eventImg} alt={team.Event.name} width={100} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", backgroundColor: "#f0f0f0" }}>No image</div>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                          {team.Event?.name}
                        </h3>
                        <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>{team.Event?.venue}</div>
                        <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>Players: {team.TeamMembers?.length ?? 0} • Price per player: ₹{team.Event?.pricePerPlayer ?? "—"}</div>

                        <div style={{ marginTop: "12px" }}>
                          <strong>Team Members</strong>
                          <ul style={{ margin: "4px 0", padding: "0 0 0 20px" }}>
                            {team.TeamMembers.map((m) => (
                              <li key={m.id} style={{ fontSize: "0.9rem" }}>
                                {m.name} ({m.rollNumber}) — {m.phone} {m.isVerified === "VERIFIED" ? "✅" : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div>Team ID: {team.id}</div>
                        {team.paymentDetailsId ? (
                          <div style={{ backgroundColor: "green", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", marginTop: "8px" }}>Paid</div>
                        ) : (
                          <div style={{ backgroundColor: "orange", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", marginTop: "8px" }}>Pending</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#555", textAlign: "center", padding: "40px 0" }}>You have not registered for any events</div>

                {/* Suggested events */}
                <h3 style={{ marginTop: 28, marginBottom: 12, fontFamily: "Poppins, sans-serif" }}>Suggested Events</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "40px", padding: "20px", gridAutoRows: "220px" }}>
                  {suggestedEvents.map((ev) => (
                    <div key={ev.id} style={{ position: "relative", width: "100%", height: "100%", borderRadius: "8px", overflow: "hidden", background: "#f6f6f6", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)" }}>
                      {ev.eventImg ? (
                        <Image src={ev.eventImg} alt={ev.name} width={250} height={220} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "8px" }} />
                      ) : (
                        <Image src="/sports/gradient.png" alt={ev.name} width={250} height={220} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "8px" }} />
                      )}

                      <Image src="/sports/gradient.png" width={250} height={220} style={{ position: "absolute", bottom: 0, left: 0, height: "50%", width: "100%", opacity: 0.38, pointerEvents: "none", borderRadius: "0 0 8px 8px", zIndex: 1 }} alt="" />
                      <div style={{ fontFamily: "'Poppins', sans-serif", position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", color: "white", fontSize: "1rem", fontWeight: 600, textAlign: "center", zIndex: 2, padding: "2px 6px", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>{ev.name}</div>

                      <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "block" }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
