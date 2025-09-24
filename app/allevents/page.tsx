"use client";

import { trpc } from "@/utils/trpc";
// import styles from "../styles/AllEvents_NEW.module.css";

import styles from "../styles/AllEvents.module.css";
//import Link from "next/link";
import type { EventSummary } from "@/types/eventTypes";

export default function AllEventsGrid() {
  const { data: events, isLoading, error } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        {/* Left heading */}
        <div className={styles.stay_updated}>
          ALL<br />EVENTS
        </div>

        {/* GRID STARTS */}
        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            <div className={styles.Images}>
              <div className={styles.image_wrapper}>
                <img src="/sports/atheletics.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Atheltics</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/basketball.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Basketball</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/badminton.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Badminton</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/chess.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Chess</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/cricket.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Cricket</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/football.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Football</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/futsal.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Futsal</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              <div className={styles.image_wrapper}>
                <img src="/sports/powerlift.png" />
                <img src="/sports/gradient.png" className={styles.gradient} />
                <div className={styles.overlay_text_small}>Powerlifting</div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
