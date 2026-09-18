"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import styles from "../styles/SportsGrid.module.css";

const SPORTS_LIST = [
  { name: "Athletics", image: "/sports/athletics.png", href: "/dashboard/register" },
  { name: "Basketball", image: "/sports/basketball.png", href: "/dashboard/register" },
  { name: "Badminton", image: "/sports/badminton.png", href: "/dashboard/register" },
  { name: "Chess", image: "/sports/chess.png", href: "/dashboard/register" },
  { name: "Cricket", image: "/sports/cricket.png", href: "/dashboard/register" },
  { name: "Football", image: "/sports/football.png", href: "/dashboard/register" },
  { name: "Futsal", image: "/sports/futsal.png", href: "/dashboard/register" },
  { name: "Powerlifting", image: "/sports/powerlift.png", href: "/dashboard/register" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function SportsGrid() {
  return (
    <section className={styles.image_grid}>
      <div className={styles.grid}>
        <motion.div
          className={styles.stay_updated}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          ALL
          <br />
          EVENTS
        </motion.div>

        <div className={styles.sports_grid}>
          {/* Main 8 sports cards */}
          <div className={styles.column1}>
            <motion.div
              className={styles.Images}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {SPORTS_LIST.map((sport) => (
                <motion.div
                  key={sport.name}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  style={{ borderRadius: "18px", overflow: "hidden" }}
                >
                  <Link href={sport.href} className={styles.image_wrapper} style={{ display: "block" }}>
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      width={300}
                      height={300}
                      priority={false}
                    />
                    <Image
                      src="/sports/gradient.png"
                      alt=""
                      width={300}
                      height={150}
                      className={styles.gradient}
                    />
                    <div className={styles.color_overlay} />
                    <div className={styles.overlay_text_small}>{sport.name}</div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Column 2: "MORE" card */}
          <div className={styles.column2}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.4 }}
              style={{ width: "100%", height: "100%", borderRadius: "18px", overflow: "hidden" }}
            >
              <Link href="/dashboard/register" className={styles.image_wrapper} style={{ display: "block" }}>
                <Image
                  src="/sports/more.png"
                  alt="More Sports"
                  width={300}
                  height={600}
                />
                <Image
                  src="/sports/gradient.png"
                  alt=""
                  width={300}
                  height={300}
                  className={styles.gradient}
                />
                <div className={styles.color_overlay} />
                <div className={styles.overlay_text}>MORE</div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

