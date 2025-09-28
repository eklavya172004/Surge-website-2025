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
                <div className={styles.overlay_text_small}>Futsal</div>
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
