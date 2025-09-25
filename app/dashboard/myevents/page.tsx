"use client";

import React from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import styles from "../../styles/AllEvents.module.css";
import type { Team, EventSummary } from "@/types/eventTypes";

export default function MyEventsClient() {
  const { data: teams, isLoading, error } = trpc.event.getMyEvents.useQuery();
  const { data: allEvents } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div className={styles.simple_message}>Loading your events...</div>;
  if (error) return <div className={styles.simple_message}>Error: {error.message}</div>;

  const suggestedEvents: EventSummary[] = (allEvents ?? []).slice(0, 5);

  return (
    <section className={styles.image_grid}>
      {/* NOTE: using gridStack (column) so the heading appears above content */}
      <div className={styles.gridStack}>
        <div className={styles.stay_updated}>YOUR<br/>EVENTS</div>

        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            {/* If user has teams, show them in cards. Otherwise show message and suggested events */}
            {teams && teams.length > 0 ? (
              <div className={styles.teams_list}>
                {teams.map((team: Team) => (
                  <div key={team.id} className={styles.team_card}>
                    <div className={styles.team_row}>
                      <div className={styles.team_img}>
                        {team.Event?.eventImg ? (
                          <img src={team.Event.eventImg} alt={team.Event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div className={styles.no_image}>No image</div>
                        )}
                      </div>

                      <div className={styles.team_info}>
                        <h3 className={styles.team_title}>
                          <Link href={`/dashboard/events/${team.Event?.slug}`}>{team.Event?.name}</Link>
                        </h3>
                        <div className={styles.team_sub}>{team.Event?.venue}</div>
                        <div className={styles.team_sub}>Players: {team.TeamMembers?.length ?? 0} • Price per player: ₹{team.Event?.pricePerPlayer ?? "—"}</div>

                        <div className={styles.team_members}>
                          <strong>Team Members</strong>
                          <ul>
                            {team.TeamMembers.map((m) => (
                              <li key={m.id}>
                                {m.name} ({m.rollNumber}) — {m.phone} {m.isVerified === "VERIFIED" ? "✅" : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className={styles.team_meta}>
                        <div>Team ID: {team.id}</div>
                        {team.paymentDetailsId ? (
                          <div className={styles.badgePaid}>Paid</div>
                        ) : (
                          <div className={styles.badgePending}>Pending</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className={styles.no_registered}>You have not registered for any events</div>

                {/* Suggested events */}
                <h3 style={{ marginTop: 28, marginBottom: 12, fontFamily: "Poppins, sans-serif" }}>Suggested Events</h3>
                <div className={styles.Images} style={{ gridAutoRows: "220px" }}>
                  {suggestedEvents.map((ev) => (
                    <div className={styles.image_wrapper} key={ev.id}>
                      {ev.eventImg ? (
                        <img src={ev.eventImg} alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <img src="/sports/gradient.png" alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      )}

                      <img src="/sports/gradient.png" className={styles.gradient} alt="" />
                      <div className={styles.overlay_text_small}>{ev.name}</div>

                      <Link href={`/dashboard/events/${ev.slug}`}>
                        <span style={{ position: "absolute", inset: 0, zIndex: 3, display: "block" }} />
                      </Link>
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
