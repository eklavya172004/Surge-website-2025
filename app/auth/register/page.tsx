"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        // Redirect to verification request page with email param
        router.push(
          `/auth/verify-request?email=${encodeURIComponent(form.email)}`
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/login/loginbg.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#00308F]/30 to-[#0643A5]/40 backdrop-blur-[2px]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#0C56BC]/20 to-[#2140A3]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#2140A3]/20 to-[#0643A5]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#00308F]/10 to-[#0C56BC]/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10  min-h-screen flex items-center justify-center p-4">
        <div className="w-full md:max-w-7xl  flex items-center justify-center">
          {/* Register card container */}
          <div className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden md:max-w-6xl md:w-full h-[580px] relative group">
            {/* Glass effect enhancement */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl" />

            {/* Left side - Design image */}
            <div className="md:w-1/2  md:flex items-center hidden  justify-center p-0 relative overflow-hidden rounded-l-3xl">
              <Image
                src="/login/design.png"
                alt="Design"
                width={500}
                height={600}
                className="md:w-full md:h-full object-cover"
              />
            </div>

            {/* Right side - Form section */}
            <div className="md:w-1/2 w-full  bg-white/95 backdrop-blur-sm p-6 flex flex-col justify-center relative">
              <div className="absolute w-full inset-0 bg-gradient-to-br from-white/50 to-white/30 rounded-r-3xl" />

              <div className="relative z-10">
                {/* Welcome title with gradient */}
                <div className="mb-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00308F] via-[#0643A5] to-[#2140A3] bg-clip-text text-transparent mb-2">
                    Register
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#0C56BC] to-[#2140A3] rounded-full" />
                </div>

                {/* Error display */}
                {error && (
                  <div
                    className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 p-3 mb-4 rounded-lg shadow-sm animate-fade-in"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Single Form Element */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {" "}
                  {/* CHANGED */}
                  {/* Two column layout for compact form */}
                  <div className="grid md:grid-cols-2  gap-4">
                    {" "}
                    {/* CHANGED */}
                    {/* Name input */}
                    <div className="relative group">
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          name="name"
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                          onChange={handleChange}
                          value={form.name}
                          required
                          autoComplete="name"
                          aria-label="Name"
                        />
                      </div>
                    </div>
                    {/* Email input */}
                    <div className="relative group">
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                          onChange={handleChange}
                          value={form.email}
                          required
                          autoComplete="email"
                          aria-label="Email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {" "}
                    {/* CHANGED */}
                    {/* College Name input */}
                    <div className="relative group">
                      <label className="block text-gray-700 text-xs font-semibold mb-1">
                        College Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <input
                          name="collegeName"
                          placeholder="Enter your college name"
                          className="md:w-full pl-10 md:pr-4 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                          onChange={handleChange}
                          value={form.collegeName}
                          required
                          autoComplete="organization"
                          aria-label="College Name"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Password input */}
                  <div className="relative group">
                    <label className="block text-gray-700 text-xs font-semibold mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                        onChange={handleChange}
                        value={form.password}
                        required
                        autoComplete="new-password"
                        aria-label="Password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Phone input */}
                  <div className="relative group">
                    <label className="block text-gray-700 text-xs font-semibold mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        name="phone"
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                        onChange={handleChange}
                        value={form.phone}
                        required
                        autoComplete="tel"
                        aria-label="Phone"
                        minLength={10}
                      />
                    </div>
                  </div>
                  {/* Register button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-[#0C56BC] via-[#2140A3] to-[#00308F] hover:from-[#0643A5] hover:via-[#00308F] hover:to-[#2140A3] text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group ${
                      loading
                        ? "opacity-70 cursor-not-allowed transform-none"
                        : ""
                    }`}
                    aria-busy={loading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          REGISTERING...
                        </>
                      ) : (
                        "REGISTER"
                      )}
                    </span>
                  </button>
                </form>

                {/* Login link */}
                <div className="text-center mt-4">
                  <p className="text-gray-600 text-xs">
                    Already have an account?{" "}
                    <a
                      href="/auth/login"
                      className="text-transparent bg-gradient-to-r from-[#0C56BC] to-[#2140A3] bg-clip-text font-semibold hover:from-[#0643A5] hover:to-[#00308F] transition-all duration-200 relative group"
                    >
                      Login Now
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0C56BC] to-[#2140A3] group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
