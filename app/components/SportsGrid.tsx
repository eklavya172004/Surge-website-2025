import styles from '../styles/SportsGrid.module.css';

export default function SportsGrid() {
  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        <div className={styles.stay_updated}>
          ALL<br />EVENTS
        </div>
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
                <div className={styles.overlay_text_small}>Badminton</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/badminton.png" />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Chess</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/chess.png" />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Cricket</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/cricket.png" />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Football</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/football.png" />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Futsal</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/futsal.png" />
              </div>
              <div className={styles.image_wrapper}>
                <div className={styles.overlay_text_small}>Powerlifting</div>
                <img src="/sports/gradient.png" className={styles.gradient} />
                <img src="/sports/powerlift.png" />
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.image_wrapper}>
              <img src="/sports/more.png" />
              <div className={styles.overlay_text}>MORE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}