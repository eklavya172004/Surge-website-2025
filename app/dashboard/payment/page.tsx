"use client";

import React, { useState } from "react";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = 500;

  const handlePayment = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage("Payment successful! Your registration is now complete.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Payment failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Payment</h1>
          <p className="text-slate-600">Complete your registration by choosing a payment method.</p>
        </div>
      </div>

      {/* Payment Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Order Summary</h2>
          <p className="text-green-100 mt-1">Registration Fees: ₹{totalAmount}</p>
        </div>

        {/* Payment Body */}
        <div className="p-8 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "UPI Payment", value: "upi" },
                { label: "Credit/Debit Card", value: "card" },
                { label: "Net Banking", value: "netbanking" }
              ].map(option => {
                const selected = paymentMethod === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value as "upi" | "card" | "netbanking")}
                    className={`cursor-pointer flex items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                      selected
                        ? "bg-green-50 border-green-600 shadow-md font-medium text-green-700"
                        : "bg-blue-50 border-blue-100 hover:shadow-sm font-medium text-slate-800"
                    }`}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input / Info Section */}
          <div className="mt-4 space-y-4">
            {paymentMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium mb-2">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="yourname@upi"
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl shadow-sm text-gray-600">
                You will be redirected to your bank&apos;s website to complete the payment.
              </div>
            )}
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
              isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isProcessing ? "Processing Payment..." : `Pay ₹${totalAmount}`}
          </button>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded text-center ${
                message.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
