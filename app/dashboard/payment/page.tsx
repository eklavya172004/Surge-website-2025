"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  Users, 
  Trophy, 
  AlertCircle,
  CreditCard,
  ArrowRight,
  Receipt
} from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function PaymentPage() {
  const [transactionId, setTransactionId] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Fetch teams (paid + unpaid)
  const { data: teams, isLoading, error, refetch } = trpc.event.getMyEvents.useQuery();

  // Mutation for submitting new payment
  const { mutateAsync, isPending } = trpc.payment.finalizePayment.useMutation();

  // Extract unpaid team IDs
  const unpaidTeamIds = teams
    ?.filter((t) => !t.paymentDetailsId)
    .map((t) => t.id) ?? [];

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      alert("Please enter your Transaction ID");
      return;
    }
    if (unpaidTeamIds.length === 0) {
      alert("No unpaid teams to submit payment for!");
      return;
    }

    try {
      const payment = await mutateAsync({
        transactionId,
        teamIds: unpaidTeamIds,
      });
      setTransactionId("");
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        refetch();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      alert("Failed to save payment");
    }
  };

  // Group teams by paymentDetailsId
  const groupedPayments = useMemo(() => {
    if (!teams) return [];

    const map = new Map();
    for (const team of teams) {
      const pid = team.paymentDetailsId ?? "UNPAID";
      if (!map.has(pid)) {
        map.set(pid, {
          id: pid,
          paymentStatus: team.PaymentDetails?.paymentStatus ?? "UNPAID",
          amount: team.PaymentDetails?.amount ?? 0,
          transactionId: team.PaymentDetails?.paymentProofUrl ?? "-",
          createdAt: team.PaymentDetails?.createdAt ?? null,
          teams: [],
        });
      }
      map.get(pid).teams.push(team);
    }
    return Array.from(map.values());
  }, [teams]);

  const getStatusConfig = (status: string) => {
    switch(status?.toUpperCase()) {
      case "VERIFIED":
        return {
          color: "from-green-500 to-emerald-600",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        };
      case "PENDING":
        return {
          color: "from-yellow-500 to-amber-600",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        };
      case "REJECTED":
        return {
          color: "from-red-500 to-rose-600",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        };
      default:
        return {
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <p className="text-gray-700 text-base sm:text-lg font-medium">Loading your teams...</p>
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
          <p className="text-red-600 text-base sm:text-lg font-semibold">Failed to load teams</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Thank You for Payment!</h3>
              <p className="text-gray-600 text-base mb-6">
                We will update your payment status in few days.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>This will close automatically...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
            Payment Hub
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">Manage your event payments seamlessly</p>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-blue-100 relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Submit Payment</h2>
                <p className="text-gray-500 text-xs sm:text-sm">Enter your transaction details below</p>
              </div>
            </div>

            {unpaidTeamIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">Pending Payment</p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      ₹{teams?.filter(t => !t.paymentDetailsId).reduce((sum, team) => 
                        sum + (team.Event?.pricePerPlayer || 0) * (team.TeamMembers?.length || 0), 0
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs sm:text-sm mb-1">Unpaid Teams</p>
                    <p className="text-xl sm:text-2xl font-bold">{unpaidTeamIds.length}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Transaction ID from Razorpay
                </label>
                <div className="relative">
                  <Receipt className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isPending || unpaidTeamIds.length === 0}
                className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 shadow-xl transition-all ${
                  isPending || unpaidTeamIds.length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }`}
              >
                {isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-gray-400 border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Payment
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </motion.button>

              {unpaidTeamIds.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-green-50 text-green-700 border border-green-200"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium">All your teams have been paid for!</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-blue-100"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Payment History</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Track all your transactions</p>
            </div>
          </div>

          {groupedPayments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg">No payments found</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Your payment history will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <AnimatePresence>
                {groupedPayments.map((payment, index) => {
                  const statusConfig = getStatusConfig(payment.paymentStatus);
                  return (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      {/* Payment Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-200">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                            <p className="font-mono text-xs sm:text-sm text-gray-500">Transaction ID</p>
                          </div>
                          <p className="font-bold text-gray-800 text-sm sm:text-base md:text-lg break-all">{payment.transactionId}</p>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
                          <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
                            {statusConfig.icon}
                            <span className={`font-semibold text-xs sm:text-sm ${statusConfig.textColor} uppercase tracking-wide`}>
                              {payment.paymentStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xl sm:text-2xl font-bold text-gray-800">₹{payment.amount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Date */}
                      {payment.createdAt && (
                        <div className="flex items-center gap-2 mb-4 sm:mb-5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            Paid on {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}

                      {/* Teams Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                          <p className="font-semibold text-sm sm:text-base text-gray-800">Registered Teams ({payment.teams.length})</p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          {payment.teams.map((team) => (
                            <motion.div
                              key={team.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="ml-2 sm:ml-4 pl-3 sm:pl-5 border-l-4 border-blue-200 bg-blue-50/50 rounded-r-xl p-3 sm:p-4"
                            >
                              <div className="flex items-start justify-between mb-3 gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-800 text-base sm:text-lg break-words">{team.name}</p>
                                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="break-words">{team.Event.name}</span>
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-gray-500">Amount</p>
                                  <p className="font-bold text-sm sm:text-base text-blue-600">
                                    ₹{(team.Event?.pricePerPlayer || 0) * (team.TeamMembers?.length || 0)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                                  <p className="text-xs sm:text-sm font-semibold text-gray-700">
                                    Team Members ({team.TeamMembers.length})
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {team.TeamMembers.map((member) => (
                                    <div
                                      key={member.id}
                                      className="bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-700 border border-blue-100 break-words"
                                    >
                                      {member.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}