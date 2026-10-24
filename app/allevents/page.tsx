"use client";

import { trpc } from "@/utils/trpc";
// import styles from "../styles/AllEvents_NEW.module.css";
import Image from "next/image";

import styles from "../styles/AllEvents.module.css";
//import Link from "next/link";

export default function AllEventsGrid() {
  const { isLoading } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        {/* Left heading */}
        <div className={styles.stay_updated}>
          ALL
          <br />
          EVENTS
        </div>

        {/* Notice Banner */}
        <div
          style={{
            margin: "0 20px 20px 20px",
            padding: "14px 22px",
            background: "linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)",
            border: "1.5px solid #fecaca",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.08)",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0 }}>📢</span>
          <div style={{ color: "#991b1b", fontSize: "14px", fontWeight: "600", lineHeight: "1.4" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "2px 8px",
                borderRadius: "6px",
                marginRight: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Update
            </span>
            Registration is closed for <strong>Cricket Men</strong>, <strong>Football Men</strong>, <strong>Powerlifting</strong>, <strong>Basketball Women</strong> & <strong>Select Athletics Events</strong> (Closed due to excess participants, hope to see you in Surge’27!!). Other sports are still open.
          </div>
        </div>

        {/* GRID STARTS */}
        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            <div className={styles.Images}>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/athletics.png"
                  width={500}
                  height={300}
                  alt="Athletics"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Athletics</div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.5)",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Select Closed
                </div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/basketball.png"
                  width={500}
                  height={300}
                  alt="Basketball"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Basketball</div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.5)",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Women Closed
                </div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/badminton.png"
                  width={500}
                  height={300}
                  alt="Badminton"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Badminton</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/chess.png"
                  width={500}
                  height={300}
                  alt="Chess"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Chess</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/cricket.png"
                  width={500}
                  height={300}
                  alt="Cricket"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Cricket</div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.5)",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Men Closed
                </div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/football.png"
                  width={500}
                  height={300}
                  alt="Football"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Football</div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.5)",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Men Closed
                </div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/futsal.png"
                  width={500}
                  height={300}
                  alt="Futsal"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Futsal Women</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.5)",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Closed
                </div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  width={500}
                  height={300}
                  alt=""
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  width={500}
                  height={300}
                  alt=""
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  width={500}
                  height={300}
                  alt=""
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  width={500}
                  height={300}
                  alt=""
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/powerlift.png"
                  width={500}
                  height={300}
                  alt="Powerlifting"
                />
                <Image
                  src="/sports/gradient.png"
                  className={styles.gradient}
                  alt="Gradient"
                />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
