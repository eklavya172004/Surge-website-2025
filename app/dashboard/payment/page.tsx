"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // In a real implementation, we would fetch cart items and calculate total
  // For now, we'll use a placeholder
  const totalAmount = 500; // This should come from cart items

  const handlePayment = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      // In a real implementation, we would:
      // 1. Call a TRPC mutation to process payment
      // 2. Update team records with payment details
      // 3. Handle success/error responses
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage("Payment successful! Your registration is now complete.");
    } catch (error: any) {
      setMessage(`Payment failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex justify-between mt-2">
            <span>Registration Fees</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between mt-2 font-bold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
                className="mr-2"
              />
              UPI Payment
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod === "netbanking"}
                onChange={() => setPaymentMethod("netbanking")}
                className="mr-2"
              />
              Net Banking
            </label>
          </div>
        </div>
        
        {paymentMethod === "upi" && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="yourname@upi"
            />
          </div>
        )}
        
        {paymentMethod === "card" && (
          <div className="mb-6 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="MM/YY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === "netbanking" && (
          <div className="mb-6">
            <p className="text-gray-600">You will be redirected to your bank's website to complete the payment.</p>
          </div>
        )}
        
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-3 rounded font-medium ${
            isProcessing 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isProcessing ? "Processing Payment..." : `Pay ₹${totalAmount}`}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded text-center ${
            message.includes("successful") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}