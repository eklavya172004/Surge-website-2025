"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { Trash2, ShoppingCart, Users, CreditCard, ArrowRight, AlertCircle } from "lucide-react";

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

export default function CartPage() {
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

  if (isLoading || loading) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-6 h-6 border-3 border-hsl(190, 70%, 50%) border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>Error Loading Cart</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4" style={{ background: 'hsl(220, 10%, 16%)' }}>
            <ShoppingCart className="w-8 h-8" style={{ color: 'hsl(190, 70%, 50%)' }} />
          </div>
        </div>
        <h1 className="text-3xl font-mono mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
          Your Cart
        </h1>
        <p className="" style={{ color: 'hsl(220, 11%, 35%)' }}>Review your selected events and teams</p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6" style={{ color: 'hsl(340, 80%, 66%)' }}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-mono">{error}</p>
          </div>
        </div>
      )}
      
      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full" 
               style={{ background: 'hsl(220, 10%, 16%)' }}>
            <ShoppingCart className="w-12 h-12" style={{ color: 'hsl(220, 11%, 35%)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(220, 45%, 90%)' }}>Your cart is empty</h3>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'hsl(220, 11%, 35%)' }}>
            Looks like you haven&apos;t added any events to your cart yet. Start exploring and register for exciting events!
          </p>
          <a
            href="/dashboard/register"
            className="inline-flex items-center px-6 py-3 rounded-xl font-bold"
            style={{
              background: 'hsl(190, 70%, 50%)',
              color: 'white'
            }}
          >
            <span>Register for Events</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div className="space-y-6 mb-8">
            {cartItems.map((item, index) => {
              const pricePerPlayer = item.Event.pricePerPlayer ?? 0;
              const total = pricePerPlayer * item.TeamMembers.length;
              
              return (
                <div 
                  key={item.id}
                  className="rounded-xl p-6"
                  style={{ 
                    background: 'hsl(220, 10%, 11%)',
                    border: '1px solid hsl(220, 10%, 16%)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
                        {item.Event.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
                          <Users className="w-4 h-4 mr-2" style={{ color: 'hsl(279, 80%, 66%)' }} />
                          <span className="font-mono">{item.TeamMembers.length} players</span>
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'hsl(190, 70%, 50%)' }}>
                          ₹{total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={deleteTeamMutation.isPending}
                      className="p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'hsl(340, 80%, 66%)', color: 'white' }}
                    >
                      {deleteTeamMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="rounded-xl p-4" style={{ background: 'hsl(220, 10%, 16%)' }}>
                    <h4 className="font-mono mb-3 flex items-center" style={{ color: 'hsl(220, 45%, 90%)' }}>
                      <Users className="w-4 h-4 mr-2" style={{ color: 'hsl(190, 70%, 50%)' }} />
                      Team Members
                    </h4>
                    <div className="grid gap-2">
                      {item.TeamMembers.map((member, memberIndex) => (
                        <div 
                          key={member.id}
                          className="p-3 rounded-lg"
                          style={{ background: 'hsl(220, 10%, 20%)', border: '1px solid hsl(220, 10%, 25%)' }}
                        >
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="font-semibold" style={{ color: 'hsl(220, 45%, 90%)' }}>{member.name}</span>
                            <span className="px-2 py-1 rounded-full text-xs font-mono" 
                                  style={{ background: 'hsl(220, 10%, 30%)', color: 'hsl(190, 70%, 50%)' }}>
                              {member.rollNumber}
                            </span>
                            <span style={{ color: 'hsl(220, 11%, 35%)' }}>{member.email}</span>
                            <span style={{ color: 'hsl(220, 11%, 35%)' }}>{member.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Total and Checkout */}
          <div className="rounded-xl p-8" style={{ 
            background: 'linear-gradient(135deg, hsl(220, 10%, 11%), hsl(240, 10%, 15%))',
            border: '1px solid hsl(220, 10%, 16%)'
          }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="mb-2" style={{ color: 'hsl(220, 11%, 35%)' }}>Total Amount</p>
                <div className="text-4xl font-bold" style={{ color: 'hsl(190, 70%, 50%)' }}>
                  ₹{calculateTotal().toLocaleString()}
                </div>
              </div>
              <button
                className="flex items-center px-8 py-4 rounded-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(190, 70%, 50%), hsl(190, 80%, 60%))',
                  color: 'white'
                }}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Proceed to Payment</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}