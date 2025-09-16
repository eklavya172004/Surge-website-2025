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



// This below version of code displays additional information about the sports below its image

// "use client";

// import { trpc } from "@/utils/trpc";
// import styles from "../styles/SportsGrid.module.css";
// import Link from "next/link";
// import Image from "next/image";

// function fmtDate(d?: string | null) {
//   if (!d) return "TBA";
//   try {
//     return new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return d;
//   }
// }

// export default function AllEventsGrid() {
//   const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

//   if (isLoading) return <div className="p-8">Loading events…</div>;
//   if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
//   if (!events || events.length === 0) return <div className="p-8">No events found.</div>;

//   // Use first 8 as before; you can adjust slice size if needed
//   const mainEvents = events.slice(0, 8);
//   const hasMore = events.length > 8;

//   return (
//     <section className={styles.image_grid}>
//       <div className={styles.grid}>
//         {/* Left side heading */}
//         <div className={styles.stay_updated}>
//           ALL<br />EVENTS
//         </div>

//         {/* Right side grid */}
//         <div className={styles.sports_grid}>
//           <div className={styles.column1}>
//             <div className={styles.Images}>
//               {mainEvents.map((ev) => (
//                 <div key={ev.id} className={styles.image_wrapper}>
//                   <Link href={`/events/${ev.slug}`} className="block">
//                     {/* Image area */}
//                     {ev.eventImg ? (
//                       <Image
//                         src={ev.eventImg}
//                         alt={ev.name}
//                         width={600}
//                         height={600}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     ) : (
//                       <div style={{ width: "100%", height: "100%", background: "#e6e6e6" }} />
//                     )}

//                     {/* Gradient overlay (keeps your existing gradient image) */}
//                     <img src="/sports/gradient.png" className={styles.gradient} alt="" />

//                     {/* Title overlay on image */}
//                     <div className={styles.overlay_text_small}>{ev.name}</div>
//                   </Link>

//                   {/* Info panel below image */}
//                   <div className="mt-3 px-1 text-sm">
//                     <div className="text-xs text-gray-600">Venue</div>
//                     <div className="text-sm font-medium mb-1">{ev.venue ?? "TBA"}</div>

//                     <div className="text-xs text-gray-600">Dates</div>
//                     <div className="text-sm mb-1">
//                       {fmtDate(ev.dateFrom)} — {fmtDate(ev.dateTo)}
//                     </div>

//                     <div className="flex gap-3 text-xs text-gray-600">
//                       <div>
//                         <div className="text-xs text-gray-600">Price</div>
//                         <div className="text-sm">₹{ev.pricePerPlayer ?? "—"}</div>
//                       </div>

//                       <div>
//                         <div className="text-xs text-gray-600">Category</div>
//                         <div className="text-sm">{ev.category ?? "—"}</div>
//                       </div>

//                       <div>
//                         <div className="text-xs text-gray-600">Players</div>
//                         <div className="text-sm">
//                           {ev.minPlayers ?? "—"} – {ev.maxPlayers ?? "—"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* More card on the right */}
//           <div className={styles.column2}>
//             <div className={styles.image_wrapper}>
//               <Link href="/events">
//                 <Image
//                   src="/sports/more.png"
//                   alt="More events"
//                   width={800}
//                   height={800}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//                 <div className={styles.overlay_text}>{hasMore ? "MORE" : "EVENTS"}</div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
