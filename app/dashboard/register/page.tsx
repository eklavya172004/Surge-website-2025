"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  User, 
  Hash,
  Plus,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";

type PlayerDetails = {
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
};

export default function RegisterPage() {
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
  
  const { data: events, isLoading, error } = trpc.reg.getAvailableSports.useQuery();
  const createTeamMutation = trpc.reg.createTeamWithMembers.useMutation();

  // Update player details array when player count changes
  useEffect(() => {
    setPlayerDetails(prevPlayerDetails => 
      Array(players)
        .fill(null)
        .map((_, i) => prevPlayerDetails[i] || { name: "", email: "", rollNumber: "", phone: "" })
    );
  }, [players]);

  const { data: eventDetails } = trpc.reg.getEventDetails.useQuery(
    { sportSlug: selectedEvent },
    { enabled: !!selectedEvent }
  );

  const handlePlayerDetailChange = (index: number, field: keyof PlayerDetails, value: string) => {
    const updatedDetails = [...playerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPlayerDetails(updatedDetails);
  };

  const addPlayer = () => {
    if (eventDetails && players < (eventDetails.maxPlayers ?? 100)) {
      setPlayers(prev => prev + 1);
    }
  };

  const removePlayer = (index: number) => {
    if (players > (eventDetails?.minPlayers ?? 1)) {
      setPlayers(prev => prev - 1);
      setPlayerDetails(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleRegister = async () => {
    if (!selectedEvent) {
      setMessage("Please select an event.");
      return;
    }

    if (!eventDetails) {
      setMessage("Selected event not found.");
      return;
    }

    if (eventDetails.minPlayers && players < eventDetails.minPlayers) {
      setMessage(`Minimum ${eventDetails.minPlayers} players required for this event.`);
      return;
    }
    
    if (eventDetails.maxPlayers && players > eventDetails.maxPlayers) {
      setMessage(`Maximum ${eventDetails.maxPlayers} players allowed for this event.`);
      return;
    }

    for (let i = 0; i < playerDetails.length; i++) {
      const player = playerDetails[i];
      if (!player.name || !player.email || !player.phone) {
        setMessage(`Please fill in all details for player ${i + 1}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await createTeamMutation.mutateAsync({
        eventId: eventDetails.id,
        players: playerDetails
      });
      
      setMessage("Team registered successfully! Check your cart to proceed.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register team";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-3 border-hsl(190, 70%, 50%) border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>Error Loading Events</h2>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-4" style={{ background: 'hsl(220, 10%, 16%)' }}>
            <Trophy className="w-8 h-8" style={{ color: 'hsl(190, 70%, 50%)' }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
            Sports Registration
          </h1>
        </div>
        <p className="text-lg" style={{ color: 'hsl(220, 11%, 35%)' }}>
          Register for exciting sports events and compete for amazing prizes!
        </p>
      </div>

      {/* Event Selection */}
      <div className="mb-8">
        <label className="block mb-2 font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
          Select Event
        </label>
        <select
          className="w-full p-4 rounded-xl font-mono"
          style={{
            background: 'hsl(220, 10%, 11%)',
            border: '1px solid hsl(220, 10%, 16%)',
            color: 'hsl(220, 30%, 80%)'
          }}
          value={selectedEvent}
          onChange={(e) => {
            setSelectedEvent(e.target.value);
            setPlayers(1);
            setPlayerDetails([{ name: "", email: "", rollNumber: "", phone: "" }]);
          }}
        >
          <option value="" style={{ background: 'hsl(220, 10%, 16%)', color: 'hsl(220, 11%, 35%)' }} disabled>
            Choose an event...
          </option>
          {events?.map((event) => (
            <option 
              key={event.id} 
              value={event.slug || event.id}
              style={{ background: 'hsl(220, 10%, 16%)', color: 'hsl(220, 30%, 80%)' }}
            >
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Event Details */}
      {eventDetails && (
        <div className="mb-8 p-6 rounded-xl" style={{ background: 'hsl(220, 10%, 11%)', border: '1px solid hsl(220, 10%, 16%)' }}>
          <h2 className="text-2xl font-mono mb-4" style={{ color: 'hsl(220, 45%, 90%)' }}>
            {eventDetails.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {eventDetails.venue && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
                <MapPin className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                <span className="font-mono">{eventDetails.venue}</span>
              </div>
            )}
            
            {(eventDetails.dateFrom && eventDetails.dateTo) && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
                <Calendar className="w-4 h-4" style={{ color: 'hsl(240, 80%, 66%)' }} />
                <span className="font-mono">
                  {new Date(eventDetails.dateFrom).toLocaleDateString()} – {new Date(eventDetails.dateTo).toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
              <Users className="w-4 h-4" style={{ color: 'hsl(279, 80%, 66%)' }} />
              <span className="font-mono">
                {eventDetails.minPlayers ?? 1} – {eventDetails.maxPlayers ?? "unlimited"} players
              </span>
            </div>
            
            {eventDetails.pricePerPlayer && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
                <span className="font-mono">₹{eventDetails.pricePerPlayer} per player</span>
              </div>
            )}
          </div>
          
          {/* Team Size Configuration */}
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
            <h3 className="font-mono mb-3 flex items-center gap-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
              <Users className="w-4 h-4" />
              Team Size Configuration
            </h3>
            <div className="flex items-center gap-4">
              <label className="font-mono" style={{ color: 'hsl(220, 30%, 80%)' }}>Number of Players:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlayers(Math.max(eventDetails.minPlayers ?? 1, players - 1))}
                  disabled={players <= (eventDetails.minPlayers ?? 1)}
                  className="w-8 h-8 rounded-full font-bold disabled:opacity-50"
                  style={{
                    background: 'hsl(340, 80%, 66%)',
                    color: 'white'
                  }}
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-lg" 
                      style={{ background: 'hsl(220, 10%, 16%)', border: '1px solid hsl(220, 10%, 20%)' }}>
                  {players}
                </span>
                <button
                  onClick={() => setPlayers(Math.min(eventDetails.maxPlayers ?? 100, players + 1))}
                  disabled={players >= (eventDetails.maxPlayers ?? 100)}
                  className="w-8 h-8 rounded-full font-bold disabled:opacity-50"
                  style={{
                    background: 'hsl(190, 70%, 50%)',
                    color: 'white'
                  }}
                >
                  +
                </button>
              </div>
              <span className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>
                ({eventDetails.minPlayers ?? 1} - {eventDetails.maxPlayers ?? "unlimited"} allowed)
              </span>
            </div>
            {eventDetails.pricePerPlayer && (
              <div className="mt-4 p-3 rounded-lg" style={{ background: 'hsl(220, 10%, 16%)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-mono" style={{ color: 'hsl(220, 30%, 80%)' }}>Total Registration Cost:</span>
                  <span className="font-bold text-xl" style={{ color: 'hsl(190, 70%, 50%)' }}>
                    ₹{(eventDetails.pricePerPlayer * players).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Registration */}
      {selectedEvent && (
        <div>
          <h3 className="text-xl font-mono mb-4 flex items-center gap-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
            <Users className="w-5 h-5" />
            Player Details ({playerDetails.length} players)
          </h3>
          
          <div className="space-y-6 mb-8">
            {playerDetails.map((player, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl"
                style={{ background: 'hsl(220, 10%, 11%)', border: '1px solid hsl(220, 10%, 16%)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-mono flex items-center gap-3" style={{ color: 'hsl(220, 45%, 90%)' }}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full" 
                         style={{ background: 'hsl(190, 70%, 50%)' }}>
                      {i + 1}
                    </div>
                    Player {i + 1}
                  </h4>
                  {playerDetails.length > (eventDetails?.minPlayers ?? 1) && (
                    <button
                      onClick={() => removePlayer(i)}
                      className="p-2 rounded-xl"
                      style={{ color: 'hsl(340, 80%, 66%)', background: 'hsl(220, 10%, 16%)' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-mono mb-2" style={{ color: 'hsl(220, 30%, 80%)' }}>
                      <User className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg font-mono"
                      style={{
                        background: 'hsl(220, 10%, 16%)',
                        border: '1px solid hsl(220, 10%, 20%)',
                        color: 'hsl(220, 30%, 80%)'
                      }}
                      placeholder="Enter player name"
                      value={player.name}
                      onChange={(e) => handlePlayerDetailChange(i, "name", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-mono mb-2" style={{ color: 'hsl(220, 30%, 80%)' }}>
                      <Mail className="w-4 h-4" style={{ color: 'hsl(240, 80%, 66%)' }} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-lg font-mono"
                      style={{
                        background: 'hsl(220, 10%, 16%)',
                        border: '1px solid hsl(220, 10%, 20%)',
                        color: 'hsl(220, 30%, 80%)'
                      }}
                      placeholder="player@college.edu"
                      value={player.email}
                      onChange={(e) => handlePlayerDetailChange(i, "email", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-mono mb-2" style={{ color: 'hsl(220, 30%, 80%)' }}>
                      <Hash className="w-4 h-4" style={{ color: 'hsl(279, 80%, 66%)' }} />
                      Roll Number
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg font-mono"
                      style={{
                        background: 'hsl(220, 10%, 16%)',
                        border: '1px solid hsl(220, 10%, 20%)',
                        color: 'hsl(220, 30%, 80%)'
                      }}
                      placeholder="e.g., CSE2021001"
                      value={player.rollNumber}
                      onChange={(e) => handlePlayerDetailChange(i, "rollNumber", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-mono mb-2" style={{ color: 'hsl(220, 30%, 80%)' }}>
                      <Phone className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 rounded-lg font-mono"
                      style={{
                        background: 'hsl(220, 10%, 16%)',
                        border: '1px solid hsl(220, 10%, 20%)',
                        color: 'hsl(220, 30%, 80%)'
                      }}
                      placeholder="+91 9876543210"
                      value={player.phone}
                      onChange={(e) => handlePlayerDetailChange(i, "phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {playerDetails.length < (eventDetails?.maxPlayers ?? 100) && (
            <button
              onClick={addPlayer}
              className="flex items-center gap-3 p-4 mb-6"
              style={{
                background: 'hsl(190, 70%, 50%)',
                color: 'white',
                borderRadius: '0.5rem'
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Team Member</span>
            </button>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t" style={{ borderColor: 'hsl(220, 10%, 16%)' }}>
            <button
              onClick={handleRegister}
              disabled={!selectedEvent || isSubmitting}
              className="flex items-center gap-4 px-6 py-3 rounded-xl font-bold disabled:opacity-50"
              style={{
                background: 'hsl(190, 70%, 50%)',
                color: 'white'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering Team...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Register Team
                </>
              )}
            </button>
            
            <Link href="/dashboard/cart">
              <button className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold"
                style={{
                  background: 'hsl(279, 80%, 66%)',
                  color: 'white'
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl mt-4 ${message.includes("Error") ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"}`}>
          <div className="flex items-center gap-2 font-semibold">
            {message.includes("Error") ? "❌" : "✅"}
            {message}
          </div>
        </div>
      )}
    </div>
  );
}