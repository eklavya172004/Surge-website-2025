"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        if (res.error.toLowerCase().includes("verify")) {
          setError(
            "Please verify your email before logging in. Check your inbox for the verification email."
          );
        } else {
          setError("Invalid email or password");
        }
      } else {
        // fetch session to check emailVerified (server must return that in /api/auth/session)
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.ok) {
          const session = await sessionRes.json();
          if (session?.user?.emailVerified) {
            router.push("/dashboard");
          } else {
            router.push(
              `/auth/verify-request?email=${encodeURIComponent(email)}`
            );
          }
        } else {
          // if session endpoint failed, fallback to dashboard
          router.push("/dashboard");
        }
      }
    } catch (_err) {
      setError("An unexpected error occurred");
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-center">
          {/* Login card container */}
          <div className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full h-[550px] relative group">
            {/* Glass effect enhancement */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl" />

            {/* Left side - Design image */}
            <div className="w-1/2 flex items-center justify-center p-0 relative overflow-hidden rounded-l-3xl">
              <img
                src="/login/design.png"
                alt="Design"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side - Form section */}
            <div className="w-1/2 bg-white/95 backdrop-blur-sm p-12 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 rounded-r-3xl" />

              <div className="relative z-10">
                {/* Welcome title with gradient */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00308F] via-[#0643A5] to-[#2140A3] bg-clip-text text-transparent mb-2">
                    Welcome
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#0C56BC] to-[#2140A3] rounded-full" />
                </div>

                {/* Message and Error display */}
                {message && (
                  <div
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-800 p-4 mb-6 rounded-lg shadow-sm animate-fade-in"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {message}
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-lg shadow-sm animate-fade-in"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-red-500"
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
                      {error}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email input with enhanced styling */}
                  <div className="relative group">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                        <svg
                          className="w-5 h-5"
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
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200/50 rounded-xl text-base placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        aria-label="Email"
                      />
                    </div>
                  </div>

                  {/* Password input with enhanced styling */}
                  <div className="relative group">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#0C56BC] transition-colors duration-200">
                        <svg
                          className="w-5 h-5"
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
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-4 bg-white/80 border-2 border-gray-200/50 rounded-xl text-base placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0C56BC] focus:border-[#0C56BC] transition-all duration-300 hover:bg-white/90 hover:shadow-md caret-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
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
                            className="w-5 h-5"
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

                  {/* Login button with enhanced styling */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 bg-gradient-to-r from-[#0C56BC] via-[#2140A3] to-[#00308F] hover:from-[#0643A5] hover:via-[#00308F] hover:to-[#2140A3] text-white rounded-xl font-bold text-base uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group ${
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
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          LOGGING IN...
                        </>
                      ) : (
                        "LOGIN"
                      )}
                    </span>
                  </button>
                </form>

                {/* Registration link with enhanced styling */}
                <div className="text-center mt-8">
                  <p className="text-gray-600 text-sm">
                    Don&apos;t have an account yet?{" "}
                    <a
                      href="/auth/register"
                      className="text-transparent bg-gradient-to-r from-[#0C56BC] to-[#2140A3] bg-clip-text font-semibold hover:from-[#0643A5] hover:to-[#00308F] transition-all duration-200 relative group"
                    >
                      Register Now
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
