import Image from "next/image";
import styles from "../styles/Footer.module.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Ball Graphic on Left */}
      <div className={styles.ballWrapper}>
        <Image
          src="/footer/ball.svg"
          alt="Ball Graphic"
          width={145}
          height={290}
          className={styles.ball}
        />
      </div>

      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <Image
            src="/footer/surge-logo.svg"
            alt="Surge Logo"
            className={styles.surgeLogo}
            width={280}
            height={37}
            priority
            style={{ width: "280px", height: "auto" }}
          />
          <nav className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="#">About Us</Link>
            <Link href="/dashboard/register">All Events Registration</Link>
          </nav>
        </div>

        {/* Middle Section */}
        <div className={styles.middleSection}>
          <h3>Contact Us</h3>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <span>surge@snu.edu.in</span>
          </div>
          <div className={styles.contactItem}>
            <FaPhoneAlt className={styles.icon} />
            <span>+91 6290 742 854</span>
          </div>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <span>
              Shiv Nadar University
              <br />
              NH91, Tehsil Dadri
              <br />
              Greater Noida, Uttar Pradesh
              <br />
              201314
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <Image
            src="/footer/shiv-nadar.svg"
            alt="Shiv Nadar University Logo"
            width={140}
            height={48}
            className={styles.shivNadarLogo}
          />
          <div className={styles.socials}>
            <a
              href="https://www.instagram.com/surge.snu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/surge-snioe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a href="mailto:surge@snu.edu.in" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Line */}
      <div className={styles.footerLine}></div>
    </footer>
  );
}
