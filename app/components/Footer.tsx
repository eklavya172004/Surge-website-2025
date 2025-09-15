import Image from "next/image";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <Image
          src="/surge-logo.svg"
          alt="Surge Logo"
          className={styles.logo}
          width={225}
          height={40}
          priority
        />
      </div>

      <div className={styles.footerBottom}>
        {/* Subscribe Section */}
        <h2 className={styles.subscribeText}>SUBSCRIBE TO OUR</h2>
        <h2 className={styles.newsletterText}>NEWSLETTER</h2>
        <input type="email" placeholder="Email" className={styles.emailInput} />
        <button className={styles.subscribeButton}>Subscribe</button>

        {/* Navigation Section */}
        <p className={styles.navigationHeading}>Navigation</p>
        <div className={styles.navigationLinks}>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Countdown</a>
          <a href="#">All Events</a>
          <a href="#">Events Map</a>
          <a href="#">Contact</a>
        </div>

        {/* Social Media Section */}
        <p className={styles.socialHeading}>Social Media</p>
        <div className={styles.socialLinks}>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Facebook</a>
          <a href="#">YouTube</a>
          <a href="#">X</a>
        </div>

        {/* Policy Section */}
        <p className={styles.policyHeading}>Policy</p>
        <div className={styles.policyLinks}>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Website Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
