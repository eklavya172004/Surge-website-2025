"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PlayerDetails = {
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
};

export default function RegisterPage() {
  const { data: events, isLoading, error } = trpc.reg.getAvailableSports.useQuery();
  const createTeamMutation = trpc.reg.createTeamWithMembers.useMutation();
  
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [players, setPlayers] = useState<number>(1);
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails[]>([{ 
    name: "", 
    email: "", 
    rollNumber: "", 
    phone: "" 
  }]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  // Update player details array when player count changes
  useEffect(() => {
    setPlayerDetails(Array(players).fill(null).map((_, i) => 
      playerDetails[i] || { name: "", email: "", rollNumber: "", phone: "" }
    ));
  }, [players, playerDetails]);

  // Reset form when event changes
  useEffect(() => {
    if (selectedEvent && events) {
      const event = events.find(e => e.id === selectedEvent);
      if (event) {
        // Set player count to minPlayers if available, otherwise 1
        const initialPlayerCount = event.minPlayers ?? 1;
        setPlayers(initialPlayerCount);
        
        // Initialize player details array with the correct number of players
        setPlayerDetails(
          Array(initialPlayerCount)
            .fill(null)
            .map(() => ({ name: "", email: "", rollNumber: "", phone: "" }))
        );
      }
    }
  }, [selectedEvent, events]);

  const selectedEventData = events?.find(e => e.id === selectedEvent);

  const handlePlayerDetailChange = (index: number, field: keyof PlayerDetails, value: string) => {
    const updatedDetails = [...playerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPlayerDetails(updatedDetails);
  };

  const handleAddToCart = async () => {
    if (!selectedEvent) {
      setMessage("Please select an event.");
      return;
    }

    if (!selectedEventData) {
      setMessage("Selected event not found.");
      return;
    }

    // Validate player count
    if (selectedEventData.minPlayers && players < selectedEventData.minPlayers) {
      setMessage(`Minimum ${selectedEventData.minPlayers} players required for this event.`);
      return;
    }
    
    if (selectedEventData.maxPlayers && players > selectedEventData.maxPlayers) {
      setMessage(`Maximum ${selectedEventData.maxPlayers} players allowed for this event.`);
      return;
    }

    // Validate player details
    for (let i = 0; i < playerDetails.length; i++) {
      const player = playerDetails[i];
      if (!player.name || !player.email || !player.rollNumber || !player.phone) {
        setMessage(`Please fill in all details for player ${i + 1}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Create team with members using TRPC mutation
      await createTeamMutation.mutateAsync({
        eventId: selectedEvent,
        players: playerDetails
      });
      
      setMessage("Team registered successfully!");
      
      // Redirect to cart after successful registration
      setTimeout(() => {
        router.push("/dashboard/cart");
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register team";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading events...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Register for Events</h1>
      
      <div className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose an event</option>
            {events?.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEventData && (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2">{selectedEventData.name}</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <strong>Players:</strong> {selectedEventData.minPlayers ?? 1} - {selectedEventData.maxPlayers ?? 1}
              </div>
              <div>
                <strong>Price per player:</strong> ₹{selectedEventData.pricePerPlayer ?? "—"}
              </div>
              <div>
                <strong>Category:</strong> {selectedEventData.category ?? "—"}
              </div>
              <div>
                <strong>Venue:</strong> {selectedEventData.venue ?? "—"}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of Players</label>
              <input
                type="number"
                min={selectedEventData.minPlayers ?? 1}
                max={selectedEventData.maxPlayers ?? 100} // Set a reasonable upper limit
                value={players}
                onChange={(e) => setPlayers(Math.max(selectedEventData.minPlayers ?? 1, Math.min(selectedEventData.maxPlayers ?? 100, Number(e.target.value))))}
                className="w-full p-2 border rounded"
              />
              <div className="text-sm text-gray-500 mt-1">
                Select number of players ({selectedEventData.minPlayers ?? 1} - {selectedEventData.maxPlayers ?? "unlimited"})
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Player Details</h3>
              {playerDetails.map((player, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                  <h4 className="font-medium mb-2">Player {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerDetailChange(index, "name", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={player.email}
                        onChange={(e) => handlePlayerDetailChange(index, "email", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={player.rollNumber}
                        onChange={(e) => handlePlayerDetailChange(index, "rollNumber", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Roll number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={player.phone}
                        onChange={(e) => handlePlayerDetailChange(index, "phone", e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedEvent || isSubmitting}
            className={`px-4 py-2 rounded ${selectedEvent && !isSubmitting ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            {isSubmitting ? "Registering..." : "Register Team"}
          </button>
          
          <Link href="/dashboard/cart">
            <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
              View Cart
            </button>
          </Link>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes("Error") || message.includes("Please") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}