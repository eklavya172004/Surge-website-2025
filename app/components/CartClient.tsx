"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, Users, CreditCard, ArrowRight, AlertCircle } from "lucide-react";
import { trpc } from "@/utils/trpc";

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
    }
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
      return total + (pricePerPlayer * item.TeamMembers.length);
    }, 0);
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-gray-600 font-medium">Loading your cart...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br  p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Cart</h2>
              <p className="text-gray-600">Please try refreshing the page</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r text-white bg-clip-text  mb-2">
            Your Cart
          </h1>
          <p className="text-gray-400">Review your selected events and teams</p>
        </motion.div>
        
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-6 shadow-sm"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700 font-medium">{error}</p>
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
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
            >
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you have&apos;t added any events to your cart yet. Start exploring and register for exciting events!
            </p>
            <motion.a
              href="/dashboard/register"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Register for Events</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        ) : (
          <div>
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 mb-8"
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
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl font-bold text-gray-900 mb-2"
                          >
                            {item.Event.name}
                          </motion.h3>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              <span className="font-medium">{item.TeamMembers.length} players</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              ₹{total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveFromCart(item.id)}
                          disabled={deleteTeamMutation.isPending}
                          className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteTeamMutation.isPending ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="rounded-xl p-4"
                      >
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Team Members
                        </h4>
                        <div className="grid gap-2">
                          {item.TeamMembers.map((member, memberIndex) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + memberIndex * 0.1 }}
                              className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                            >
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="font-semibold text-gray-900">{member.name}</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {member.rollNumber}
                                </span>
                                <span className="text-gray-600">{member.email}</span>
                                <span className="text-gray-600">{member.phone}</span>
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
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-8 shadow-xl border border-white/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 mb-2">Total Amount</p>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                  >
                    ₹{calculateTotal().toLocaleString()}
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert("Proceed to payment")}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>Proceed to Payment</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}