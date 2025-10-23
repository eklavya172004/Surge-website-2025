import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Footer.module.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedin,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const [rating, setRating] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const feedback = formData.get('feedback') as string;
    
    const data = {
      name: name || null,
      rating: rating, // Use the rating state directly
      feedback,
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Thank you for your feedback!' });
        form.reset();
        setRating(0);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit feedback' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Feedback Form */}
          <div className={styles.feedbackSection}>
            <h4>Leave Feedback</h4>
            <form onSubmit={handleSubmit} className={styles.feedbackForm}>
              <input
                type="text"
                name="name"
                placeholder="Your Name (Optional)"
                className={styles.formInput}
              />
              <div className={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className={styles.starWrapper}
                  >
                    {i < rating ? (
                      <FaStar className={styles.starFilled} />
                    ) : (
                      <FaRegStar className={styles.starEmpty} />
                    )}
                  </span>
                ))}
              </div>
              <textarea
                name="feedback"
                placeholder="Your Feedback"
                required
                className={styles.formTextarea}
              />
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              {submitMessage && (
                <div className={`${styles.message} ${styles[submitMessage.type]}`}>
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>

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