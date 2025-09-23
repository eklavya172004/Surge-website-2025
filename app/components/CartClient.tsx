"use client";

import React, { useState, useEffect } from "react";
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
    rollNumber: string;
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

  if (isLoading || loading) return <div className="p-6">Loading cart...</div>;
  if (isError) return <div className="p-6">Error loading cart</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a href="/dashboard/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Register for Events
          </a>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const pricePerPlayer = item.Event.pricePerPlayer ?? 0;
              const total = pricePerPlayer * item.TeamMembers.length;
              
              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{item.Event.name}</h3>
                      <p className="text-gray-600">
                        Players: {item.TeamMembers.length} | 
                        Total: ₹{total}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={deleteTeamMutation.isPending}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleteTeamMutation.isPending ? "Removing..." : "Remove"}
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">Team Members:</h4>
                    <ul className="space-y-1">
                      {item.TeamMembers.map((member) => (
                        <li key={member.id} className="text-sm text-gray-600">
                          {member.name} ({member.rollNumber}) - {member.email}, {member.phone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total: ₹{calculateTotal()}</span>
              <button
                onClick={() => alert("Proceed to payment")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}