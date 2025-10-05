"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ShoppingCart,
  Users,
  CreditCard,
  ArrowRight,
  AlertCircle,
  X,
  CheckCircle,
  Info,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import CartMigrationClient from "./CartMigrationClient";

type CartItem = {
  id: string;
  eventId: string;
  Event: {
    name: string;
    pricePerPlayer: number | null;
  };
  TeamMembers: {
    id: string;
    name: string;
    email: string;
    rollNumber: string | null;
    phone: string;
  }[];
};

export default function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [hasReadInstructions, setHasReadInstructions] = useState(false);

  const utils = trpc.useUtils();

  // Fetch cart items
  const { data: cartData, isLoading, isError } = trpc.reg.getCart.useQuery();

  // Delete team from cart
  const deleteTeamMutation = trpc.reg.deleteTeamFromCart.useMutation({
    onSuccess: () => {
      utils.reg.getCart.invalidate();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (cartData) {
      setCartItems(cartData);
      setLoading(false);
    }
  }, [cartData]);

  const handleRemoveFromCart = (teamId: string) => {
    deleteTeamMutation.mutate({ teamId });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const pricePerPlayer = item.Event.pricePerPlayer ?? 0;
      return total + pricePerPlayer * item.TeamMembers.length;
    }, 0);
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    setIsButtonActive(true);
  };

  const handleTouchEnd = () => {
    setIsButtonActive(false);
  };

  const handleProceedToPayment = () => {
    setShowInstructionsDialog(true);
  };

  const handleConfirmPayment = () => {
    if (hasReadInstructions) {
      window.open("https://rzp.io/rzp/LVCNXd84", "_blank");
      setShowInstructionsDialog(false);
      setHasReadInstructions(false);
    }
  };

  const handleCloseDialog = () => {
    setShowInstructionsDialog(false);
    setHasReadInstructions(false);
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <CartMigrationClient />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16 sm:py-20"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Loading your cart...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <CartMigrationClient />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-16 sm:py-20"
          >
            <div className="text-center">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Error Loading Cart
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Please try refreshing the page
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
        <CartMigrationClient />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Your Cart
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Review your selected events and teams
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0" />
                <p className="text-red-700 font-medium text-sm sm:text-base break-words">
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
              Looks like you haven&apos;t added any events to your cart yet.
              Start exploring and register for exciting events!
            </p>
            <motion.a
              href="/dashboard/register"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300"
            >
              <span>Register for Events</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </motion.div>
        ) : (
          <div>
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-6 mb-6 sm:mb-8"
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => {
                  const pricePerPlayer = item.Event.pricePerPlayer ?? 0;
                  const total = pricePerPlayer * item.TeamMembers.length;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 truncate pr-2"
                          >
                            {item.Event.name}
                          </motion.h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                              <span className="font-medium text-sm sm:text-base">
                                {item.TeamMembers.length} players
                              </span>
                            </div>
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-green-600">
                              ₹{total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveFromCart(item.id)}
                          disabled={deleteTeamMutation.isPending}
                          className="p-2 sm:p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
                        >
                          {deleteTeamMutation.isPending ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </motion.button>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-50"
                      >
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          Team Members
                        </h4>
                        <div className="grid gap-2 sm:gap-3">
                          {item.TeamMembers.map((member, memberIndex) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + memberIndex * 0.1 }}
                              className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                            >
                              <div className="grid gap-1 text-xs sm:text-sm">
                                <div className="flex items-start">
                                  <span className="font-semibold text-gray-900 w-16 sm:w-20 flex-shrink-0">
                                    Name:
                                  </span>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ml-2 break-words">
                                    {member.name}
                                  </span>
                                </div>

                                <div className="flex items-start">
                                  <span className="font-semibold text-gray-900 w-16 sm:w-20 flex-shrink-0">
                                    Email:
                                  </span>
                                  <span className="text-gray-800 ml-2 break-all sm:break-words">
                                    {member.email}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <span className="font-semibold text-gray-900 w-16 sm:w-20 flex-shrink-0">
                                    Phone:
                                  </span>
                                  <span className="text-gray-800 ml-2 break-words">
                                    {member.phone}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Total and Checkout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl text-white"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-blue-100 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                    Total Amount
                  </p>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
                  >
                    ₹{calculateTotal().toLocaleString()}
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToPayment}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className={`flex items-center px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 w-full sm:w-auto justify-center ${
                    isButtonActive
                      ? "bg-green-500 text-white"
                      : "bg-white text-blue-600 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Proceed to Payment
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Instructions Dialog */}
      <AnimatePresence>
        {showInstructionsDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDialog}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dialog Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Info className="w-6 h-6 mr-3" />
                    <h2 className="text-2xl font-bold">Payment Instructions</h2>
                  </div>
                  <button
                    onClick={handleCloseDialog}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 mt-2 text-sm">
                  Please read carefully before proceeding
                </p>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-5">
                {/* Instruction Steps */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        You will be redirected to the payment portal
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Complete your payment on the Razorpay payment gateway
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        Copy the Transaction ID after payment
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Make sure to save or copy your transaction ID immediately
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        Paste the Transaction ID in the Payment Tab
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Submit the transaction ID for verification on the current transaction page
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-800 mb-1">
                        Important Notice
                      </p>
                      <p className="text-orange-700 text-sm">
                        We will notify you about the status of your payment, but you{" "}
                        <span className="font-bold">must follow these steps</span> on a mandatory basis for your payment to be counted.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkbox Confirmation */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="relative  flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={hasReadInstructions}
                        onChange={(e) => setHasReadInstructions(e.target.checked)}
                        className="w-5 h-5 border-gray-300 rounded focus:ring-2  cursor-pointer"
                      />
                      {hasReadInstructions && (
                        <CheckCircle className="w-6 h-6 text-black bg-white absolute pointer-events-none" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium text-sm group-hover:text-gray-900 transition-colors">
                      I have read and understood the payment instructions properly
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleCloseDialog}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!hasReadInstructions}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      hasReadInstructions
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}