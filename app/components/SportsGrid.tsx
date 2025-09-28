import Image from "next/image";
import styles from "../styles/SportsGrid.module.css";

export default function SportsGrid() {
  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        <div className={styles.stay_updated}>
          ALL
          <br />
          EVENTS
        </div>
        <div className={styles.sports_grid}>
          <div className={styles.column1}>
            <div className={styles.Images}>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/athletics.png"
                  alt="Athletics"
                  width={150}
                  height={150}
                />
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <div className={styles.overlay_text_small}>Athletics</div>
              </div>
              <div className={styles.image_wrapper}>
                <Image
                  src="/sports/basketball.png"
                  alt="Basketball"
                  width={150}
                  height={150}
                />
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <div className={styles.overlay_text_small}>Basketball</div>
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Badminton</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/badminton.png"
                  alt="Badminton"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Chess</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/chess.png"
                  alt="Chess"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Cricket</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/cricket.png"
                  alt="Cricket"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Football</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/football.png"
                  alt="Football"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Futsal</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/futsal.png"
                  alt="Futsal"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Powerlifting</div>
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={150}
                  height={150}
                  className={styles.gradient}
                />
                <Image
                  src="/sports/powerlift.png"
                  alt="Powerlifting"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.image_wrapper}>
              <Image
                src="/sports/more.png"
                alt="More Sports"
                width={300}
                height={300}
              />
              <Image
                src="/sports/gradient.png"
                alt=""
                width={300}
                height={300}
                className={styles.gradient}
              />
              <div className={styles.overlay_text}>MORE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

