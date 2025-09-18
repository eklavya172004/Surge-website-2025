"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    rollNumber: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Something went wrong");
      } else {
        // redirect to verification request page with email param
        router.push(`/auth/verify-request?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        {error && (
          <p className={styles.error} role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="name"
            placeholder="Name"
            className={styles.input}
            onChange={handleChange}
            value={form.name}
            required
            autoComplete="name"
            aria-label="Name"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className={styles.input}
            onChange={handleChange}
            value={form.email}
            required
            autoComplete="email"
            aria-label="Email"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
            value={form.password}
            required
            autoComplete="new-password"
            aria-label="Password"
          />

          <input
            name="collegeName"
            placeholder="College Name"
            className={styles.input}
            onChange={handleChange}
            value={form.collegeName}
            required
            autoComplete="organization"
            aria-label="College Name"
          />

          <input
            name="rollNumber"
            placeholder="Roll Number"
            className={styles.input}
            onChange={handleChange}
            value={form.rollNumber}
            required
            autoComplete="off"
            aria-label="Roll Number"
          />

          <input
            name="phone"
            placeholder="Phone"
            className={styles.input}
            onChange={handleChange}
            value={form.phone}
            required
            autoComplete="tel"
            aria-label="Phone"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
            aria-busy={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/auth/login" className={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
