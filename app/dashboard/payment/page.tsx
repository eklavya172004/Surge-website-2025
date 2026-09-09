"use client";

import { useState, useMemo } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Users, 
  Trophy, 
  AlertCircle,
  CreditCard,
  ArrowRight,
  Receipt,
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function PaymentPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"online" | "manual">("online");
  const [transactionId, setTransactionId] = useState("");
  const [isProcessingOnline, setIsProcessingOnline] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    message: string;
    refId?: string;
    amount?: number;
  } | null>(null);

  // Fetch teams (paid + unpaid)
  const { data: teams, isLoading, error, refetch } = trpc.event.getMyEvents.useQuery();

  // Mutation for submitting manual payment
  const { mutateAsync: mutateManual, isPending: isManualPending } = trpc.payment.finalizePayment.useMutation();

  // Unpaid or pending online teams that need payment
  const payableTeams = useMemo(() => {
    return teams?.filter((t) => {
      if (!t.paymentDetailsId) return true;
      if (t.PaymentDetails?.paymentStatus === "PENDING" && t.PaymentDetails?.paymentMethod === "RAZORPAY") return true;
      return false;
    }) ?? [];
  }, [teams]);

  const payableTeamIds = useMemo(() => {
    return payableTeams.map((t) => t.id);
  }, [payableTeams]);

  // Calculate total unpaid amount
  const totalUnpaidAmount = useMemo(() => {
    return payableTeams.reduce((sum, team) => {
      const price = team.Event?.pricePerPlayer || 0;
      const count = team.TeamMembers?.length || 0;
      return sum + price * count;
    }, 0);
  }, [payableTeams]);

  // Track which order is currently being cancelled
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = async (paymentId: string) => {
    if (!confirm("Are you sure you want to cancel this pending payment attempt? Your team will return to unpaid status.")) return;

    setCancellingId(paymentId);
    try {
      const res = await fetch("/api/razorpay/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentDetailsId: paymentId }),
      });
      const data = await res.json();
      if (res.ok) {
        refetch();
      } else {
        alert("Failed to cancel: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error cancelling order.");
    } finally {
      setCancellingId(null);
    }
  };

  // Group teams by paymentDetailsId for Payment History
  const groupedPayments = useMemo(() => {
    if (!teams) return [];

    const map = new Map();
    for (const team of teams) {
      const pid = team.paymentDetailsId;
      if (!pid) continue; // Only show submitted transactions in history

      if (!map.has(pid)) {
        map.set(pid, {
          id: pid,
          paymentStatus: team.PaymentDetails?.paymentStatus ?? "PENDING",
          amount: team.PaymentDetails?.amount ?? 0,
          paymentMethod: team.PaymentDetails?.paymentMethod ?? "MANUAL",
          razorpayPaymentId: team.PaymentDetails?.razorpayPaymentId,
          razorpayOrderId: team.PaymentDetails?.razorpayOrderId,
          transactionId: team.PaymentDetails?.razorpayPaymentId || team.PaymentDetails?.paymentProofUrl || pid,
          createdAt: team.PaymentDetails?.createdAt ?? null,
          teams: [],
        });
      }
      map.get(pid).teams.push(team);
    }
    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [teams]);

  // Handle Online Razorpay Payment
  const handleRazorpayPayment = async (customTeamIds?: string[]) => {
    const idsToPay = customTeamIds && customTeamIds.length > 0 ? customTeamIds : payableTeamIds;
    if (idsToPay.length === 0) {
      alert("No unpaid teams available for payment.");
      return;
    }

    setOnlineError(null);
    setIsProcessingOnline(true);

    try {
      // 1. Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamIds: idsToPay }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOnlineError(data.error || "Failed to initialize Razorpay checkout");
        setIsProcessingOnline(false);
        return;
      }

      // Check if Razorpay script is loaded on client
      if (typeof window === "undefined" || !(window as unknown as { Razorpay?: unknown }).Razorpay) {
        setOnlineError("Razorpay SDK is still loading. Please check your internet connection and refresh.");
        setIsProcessingOnline(false);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (res: unknown) => void) => void } }).Razorpay;
      
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Surge 2026 Sports Fest",
        description: `Registration for ${payableTeams.length} event(s)`,
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || session?.user?.name || "",
          email: data.user?.email || session?.user?.email || "",
          contact: data.user?.phone || session?.user?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // 3. Verify payment signature on server
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setSuccessInfo({
                title: "Payment Confirmed!",
                message: "Your payment has been successfully verified via Razorpay.",
                refId: response.razorpay_payment_id,
                amount: totalUnpaidAmount,
              });
              setShowSuccessDialog(true);
              refetch();
            } else {
              alert("Payment verification error: " + (verifyData.error || "Could not verify signature"));
            }
          } catch (verifyErr) {
            console.error("Verification call failed:", verifyErr);
            alert("Network error verifying payment. Please refresh your dashboard.");
          } finally {
            setIsProcessingOnline(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingOnline(false);
          },
        },
      };

      const rzp = new RazorpayConstructor(options);
      rzp.on("payment.failed", function (response: unknown) {
        console.error("Razorpay payment failed:", response);
        alert("Payment was not completed. You can retry anytime.");
        setIsProcessingOnline(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Error during payment flow:", err);
      setOnlineError("An unexpected error occurred. Please try again.");
      setIsProcessingOnline(false);
    }
  };

  // Handle Manual Payment Submission (for Retool verification)
  const handleManualSubmit = async () => {
    if (!transactionId.trim()) {
      alert("Please enter your Transaction Reference or Receipt ID.");
      return;
    }
    if (payableTeamIds.length === 0) {
      alert("No unpaid teams to submit payment for!");
      return;
    }

    try {
      await mutateManual({
        transactionId: transactionId.trim(),
        teamIds: payableTeamIds,
      });
      setTransactionId("");
      setSuccessInfo({
        title: "Offline Payment Submitted!",
        message: "Your transaction reference has been logged. The Surge Admin team will verify it on Retool.",
        refId: transactionId.trim(),
        amount: totalUnpaidAmount,
      });
      setShowSuccessDialog(true);
      refetch();
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to submit offline payment. Please try again.");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
      case "VERIFIED":
        return {
          color: "from-green-500 to-emerald-600",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />,
        };
      case "PENDING":
        return {
          color: "from-yellow-500 to-amber-600",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />,
        };
      case "REJECTED":
        return {
          color: "from-red-500 to-rose-600",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />,
        };
      default:
        return {
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-700 text-base sm:text-lg font-medium">Loading payment information...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-red-200 text-center max-w-md w-full"
        >
          <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-base sm:text-lg font-semibold">Failed to load registration data</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Razorpay Checkout SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-8 sm:py-12 px-3 sm:px-4 md:px-8">
        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessDialog && successInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSuccessDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center border border-gray-100"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/20"
                >
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{successInfo.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{successInfo.message}</p>

                {successInfo.refId && (
                  <div className="bg-gray-50 rounded-xl p-3.5 mb-6 text-left border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Reference / Payment ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-800 break-all">{successInfo.refId}</p>
                    {successInfo.amount && (
                      <p className="text-xs text-gray-500 mt-2">
                        Amount Paid: <strong className="text-gray-800">₹{successInfo.amount}</strong>
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              Surge 2026 Payment Portal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
              Event Registration Fees
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Confirm your spot in Surge 2026 with instant online payment via Razorpay or submit campus desk transaction receipts.
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100/80 p-5 sm:p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10">
              {/* Status Header */}
              {payableTeams.length > 0 ? (
                <div className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl text-white shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
                          Pending Registration Fees
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black">
                        ₹{totalUnpaidAmount}
                      </div>
                      <p className="text-blue-200 text-xs mt-1">
                        Calculated based on 2026 team size & sports brochure rates
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:text-right border border-white/20">
                      <p className="text-blue-100 text-xs font-medium">Unpaid Events</p>
                      <p className="text-2xl font-bold">{payableTeams.length} Sport(s)</p>
                    </div>
                  </div>

                  {/* List of Unpaid Events */}
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {payableTeams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-white/10 rounded-lg px-3 py-2 text-xs flex items-center justify-between"
                      >
                        <span className="font-medium truncate mr-2">
                          {team.Event?.name}
                        </span>
                        <span className="font-semibold text-yellow-300 shrink-0">
                          ₹{(team.Event?.pricePerPlayer || 0) * (team.TeamMembers?.length || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-base sm:text-lg">All Registered Teams Paid!</h3>
                    <p className="text-green-700 text-xs sm:text-sm">
                      You have no pending registration fees. Check your payment history below.
                    </p>
                  </div>
                </div>
              )}

              {/* Dual-Engine Payment Methods (Only shown if unpaid teams exist) */}
              {payableTeams.length > 0 && (
                <div>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActiveTab("online")}
                      className={`pb-3 px-4 font-semibold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === "online"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Instant Online Payment (Razorpay)
                    </button>
                    <button
                      onClick={() => setActiveTab("manual")}
                      className={`pb-3 px-4 font-semibold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === "manual"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Offline / Desk Payment
                    </button>
                  </div>

                  {/* Online Tab */}
                  {activeTab === "online" && (
                    <div className="space-y-4">
                      {onlineError && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Notice</p>
                            <p className="text-xs sm:text-sm mt-0.5">{onlineError}</p>
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs sm:text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                          <span>Accepted: <strong>UPI (GPay, PhonePe, Paytm)</strong>, Debit/Credit Cards, NetBanking</span>
                        </div>
                        <span className="text-green-600 font-semibold hidden sm:inline-block">Instant Receipt</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleRazorpayPayment()}
                        disabled={isProcessingOnline}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                          isProcessingOnline
                            ? "bg-gray-300 cursor-not-allowed text-gray-600"
                            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25"
                        }`}
                      >
                        {isProcessingOnline ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Connecting to Razorpay...</span>
                          </>
                        ) : (
                          <>
                            <span>Pay ₹{totalUnpaidAmount} with Razorpay</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Manual / Offline Tab */}
                  {activeTab === "manual" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                        <p className="font-semibold text-slate-900 mb-1">Paying Offline or at the Desk?</p>
                        <p>
                          If you paid via campus registration desk cash, university cheque, or RTGS/NEFT transfer, enter the Transaction Reference ID or Receipt Number below.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Transaction Reference Number / Receipt ID
                        </label>
                        <div className="relative">
                          <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. UTR / UPI Ref ID / SNU Receipt #1042"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleManualSubmit}
                        disabled={isManualPending}
                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                          isManualPending
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-slate-800 hover:bg-slate-900 text-white"
                        }`}
                      >
                        {isManualPending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Submitting for Verification...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Offline Receipt</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                      <p className="text-xs text-gray-500 text-center">
                        The Surge Admin team will verify your receipt on Retool and update the status to PAID.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100/80 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md text-white">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment History</h2>
                <p className="text-gray-500 text-xs sm:text-sm">Track your transactions and registration statuses</p>
              </div>
            </div>

            {groupedPayments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No payments submitted yet</p>
                <p className="text-gray-400 text-xs mt-1">Once you submit a payment, your receipt will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {groupedPayments.map((payment, index) => {
                    const statusConfig = getStatusConfig(payment.paymentStatus);
                    const isRazorpay = payment.paymentMethod === "RAZORPAY";

                    return (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50/50"
                      >
                        {/* Top Bar: Reference ID & Status */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  isRazorpay
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {isRazorpay ? "Razorpay Online" : "Offline / Manual"}
                              </span>
                              {payment.createdAt && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-xs sm:text-sm text-gray-600 break-all">
                              Ref: <strong className="text-gray-900">{payment.transactionId}</strong>
                            </p>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-3">
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.textColor}`}
                            >
                              {statusConfig.icon}
                              <span>{payment.paymentStatus}</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              ₹{payment.amount}
                            </div>
                          </div>
                        </div>

                        {/* Associated Teams */}
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-blue-600" />
                            Registered Events ({payment.teams.length})
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {payment.teams.map((team: {
                              id: string;
                              Event?: { name: string; pricePerPlayer?: number | null };
                              TeamMembers?: { id: string; name: string }[];
                            }) => (
                              <div
                                key={team.id}
                                className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">{team.Event?.name}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Users className="w-3 h-3" />
                                    {team.TeamMembers?.length || 0} Player(s)
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-blue-600">
                                  ₹{(team.Event?.pricePerPlayer || 0) * (team.TeamMembers?.length || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons if PENDING */}
                        {payment.paymentStatus === "PENDING" && isRazorpay && (
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                              Payment not completed. You can retry now or cancel this attempt.
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCancelOrder(payment.id)}
                                disabled={cancellingId === payment.id}
                                className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                              >
                                {cancellingId === payment.id ? "Cancelling..." : "Cancel Attempt"}
                              </button>
                              <button
                                onClick={() => handleRazorpayPayment(payment.teams.map((t: { id: string }) => t.id))}
                                disabled={isProcessingOnline}
                                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors flex items-center gap-1.5"
                              >
                                <span>Pay Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}