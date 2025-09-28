"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  User, 
  Hash,
  X,
  CheckCircle,
  Loader2,
  ShoppingCart
} from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  // ✅ Fetch event details for the selected event
  const { data: eventDetails } = trpc.reg.getEventDetails.useQuery(
    { sportSlug: selectedEvent },
    { enabled: !!selectedEvent }
  );

  // Update player details array when player count changes
  useEffect(() => {
    setPlayerDetails(prevPlayerDetails => 
      Array(players)
        .fill(null)
        .map((_, i) => prevPlayerDetails[i] || { name: "", email: "", rollNumber: "", phone: "" })
    );
  }, [players]);

  // Reset form when event changes
  useEffect(() => {
    if (selectedEvent && eventDetails) {
      const initialPlayerCount = eventDetails.minPlayers ?? 1;
      setPlayers(initialPlayerCount);

      setPlayerDetails(
        Array(initialPlayerCount)
          .fill(null)
          .map(() => ({ name: "", email: "", rollNumber: "", phone: "" }))
      );
    }
  }, [selectedEvent, eventDetails]);

  const selectedEventData = eventDetails;

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage(null);
  }, 5000); // 5 seconds

  return () => clearTimeout(timer); // cleanup if message changes before 5s
}, [message]);

  const handlePlayerDetailChange = (index: number, field: keyof PlayerDetails, value: string) => {
    const updatedDetails = [...playerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPlayerDetails(updatedDetails);
  };

  const addPlayer = () => {
    if (selectedEventData && players < (selectedEventData.maxPlayers ?? 100)) {
      setPlayers(prev => prev + 1);
    }
  };

  const removePlayer = (index: number) => {
    if (players > (selectedEventData?.minPlayers ?? 1)) {
      setPlayers(prev => prev - 1);
      setPlayerDetails(prev => prev.filter((_, i) => i !== index));
    }
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

    if (selectedEventData.minPlayers && players < selectedEventData.minPlayers) {
      setMessage(`Minimum ${selectedEventData.minPlayers} players required for this event.`);
      return;
    }
    
    if (selectedEventData.maxPlayers && players > selectedEventData.maxPlayers) {
      setMessage(`Maximum ${selectedEventData.maxPlayers} players allowed for this event.`);
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
        eventId: selectedEventData.id,
        players: playerDetails
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/dashboard/cart");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register team";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-4">
        <motion.div
          className="flex items-center gap-3 text-lg sm:text-xl text-gray-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-500" />
          Loading events...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center max-w-md w-full">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Error Loading Events</h2>
          <p className="text-red-600 text-sm sm:text-base">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 bg-white">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-center max-w-sm w-full mx-4"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
              >
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 text-sm sm:text-base">Your team has been registered successfully!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
          <motion.div
            className="flex flex-col items-center gap-3 sm:gap-4 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Sports Registration
            </h1>
          </motion.div>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-2">
            Register for exciting sports events and compete for amazing prizes!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Event Selection Card */}
          <motion.div
            className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
          >
            <motion.select
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 border-gray-300 text-gray-800 text-sm sm:text-base lg:text-lg bg-white
                         transition-all duration-300 appearance-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setPlayers(1);
                setPlayerDetails([{ name: "", email: "", rollNumber: "", phone: "" }]);
              }}
              whileFocus={{ scale: 1.01 }}
            >
              <option value="" className="text-gray-500 font-semibold" disabled>
                Choose an event...
              </option>
              {events?.map((event) => (
                <option key={event.id} className="text-gray-800" value={event.slug || event.id}>
                  {event.name}
                </option>
              ))}
            </motion.select>
          </motion.div>

          {/* Event Details Card */}
          <AnimatePresence>
            {selectedEventData && (
              <motion.div 
                className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl inline-flex items-center justify-center">
                    <Trophy className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <span className="break-words">{selectedEventData.name}</span>
                </motion.h2>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                  <motion.div 
                    className="space-y-3 sm:space-y-4"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedEventData.venue && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-gray-700 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Venue:</span>
                        <span className="text-sm sm:text-base break-words">{selectedEventData.venue}</span>
                      </div>
                    )}
                    
                    {(selectedEventData.dateFrom && selectedEventData.dateTo) && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-gray-700 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Duration:</span>
                        <span className="text-sm sm:text-base break-words">
                          {new Date(selectedEventData.dateFrom).toLocaleDateString()} – {new Date(selectedEventData.dateTo).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-gray-700 p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">Team Size:</span>
                      <span className="text-sm sm:text-base">{selectedEventData.minPlayers ?? 1} – {selectedEventData.maxPlayers ?? "unlimited"} players</span>
                    </div>

                    {selectedEventData.pricePerPlayer && (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg sm:rounded-xl">
                        <span className="font-semibold text-sm sm:text-base">Registration Fee</span>
                        <span className="font-bold text-base sm:text-lg text-green-700">₹{selectedEventData.pricePerPlayer} per player</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                {selectedEventData.rules && (
                  <motion.div 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border-2 border-blue-200 mb-6 sm:mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-bold text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">Tournament Rules & Guidelines</h3>
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed text-xs sm:text-sm lg:text-base">
                      {selectedEventData.rules}
                    </div>
                  </motion.div>
                )}

                {/* Player Count Selection */}
                <motion.div 
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border-2 border-indigo-200 mb-6 sm:mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="font-bold text-indigo-700 mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Team Size Configuration
                  </h3>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <label className="text-gray-700 font-semibold text-sm sm:text-base">Number of Players:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPlayers(Math.max(selectedEventData.minPlayers ?? 1, players - 1))}
                          disabled={players <= (selectedEventData.minPlayers ?? 1)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="w-12 sm:w-16 text-center font-bold text-base sm:text-lg bg-white rounded-lg px-2 sm:px-3 py-1 border-2 border-gray-200">
                          {players}
                        </span>
                        <button
                          onClick={() => setPlayers(Math.min(selectedEventData.maxPlayers ?? 100, players + 1))}
                          disabled={players >= (selectedEventData.maxPlayers ?? 100)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({selectedEventData.minPlayers ?? 1} - {selectedEventData.maxPlayers ?? "unlimited"} allowed)
                    </span>
                  </div>
                  {selectedEventData.pricePerPlayer && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">Total Registration Cost:</span>
                        <span className="font-bold text-lg sm:text-xl text-indigo-700">
                          ₹{(selectedEventData.pricePerPlayer * players).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Team Registration */}
          <AnimatePresence>
            {selectedEventData && (
              <motion.div 
                className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <motion.h3 
                    className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                  >
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg sm:rounded-xl">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    Player Details
                  </motion.h3>
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-100 to-blue-100 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 border-indigo-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-indigo-700 font-bold text-sm sm:text-base lg:text-lg">
                      {playerDetails.length}/{selectedEventData.maxPlayers ?? "∞"} Players
                    </span>
                  </motion.div>
                </div>

                {/* Players List */}
                <AnimatePresence>
                  <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
                    {playerDetails.map((player, i) => (
                      <motion.div
                        key={i}
                        className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6"
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: i * 0.1 }}
                        layout
                      >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <motion.h4 
                            className="text-base sm:text-lg font-bold text-gray-800"
                            whileHover={{ scale: 1.05 }}
                          >
                            Player {i + 1}
                          </motion.h4>
                          {playerDetails.length > (selectedEventData.minPlayers ?? 1) && (
                            <motion.button
                              onClick={() => removePlayer(i)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <motion.div className="space-y-1 sm:space-y-2" whileFocus={{ scale: 1.01 }}>
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 bg-white shadow-sm text-sm sm:text-base"
                              placeholder="Enter player name"
                              value={player.name}
                              onChange={(e) => handlePlayerDetailChange(i, "name", e.target.value)}
                            />
                          </motion.div>

                          <motion.div className="space-y-1 sm:space-y-2" whileFocus={{ scale: 1.01 }}>
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                              Email Address
                            </label>
                            <input
                              type="email"
                              className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 bg-white shadow-sm text-sm sm:text-base"
                              placeholder="player@college.edu"
                              value={player.email}
                              onChange={(e) => handlePlayerDetailChange(i, "email", e.target.value)}
                            />
                          </motion.div>

                          <motion.div className="space-y-1 sm:space-y-2" whileFocus={{ scale: 1.01 }}>
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                              <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                              Roll Number
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 bg-white shadow-sm text-sm sm:text-base"
                              placeholder="e.g., CSE2021001"
                              value={player.rollNumber}
                              onChange={(e) => handlePlayerDetailChange(i, "rollNumber", e.target.value)}
                            />
                          </motion.div>

                          <motion.div className="space-y-1 sm:space-y-2" whileFocus={{ scale: 1.01 }}>
                            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              className="w-full p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 bg-white shadow-sm text-sm sm:text-base"
                              placeholder="+91 9876543210"
                              value={player.phone}
                              onChange={(e) => handlePlayerDetailChange(i, "phone", e.target.value)}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Add Player Button */}
                {playerDetails.length < (selectedEventData.maxPlayers ?? 100) && (
                  <motion.button
                    onClick={addPlayer}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg mb-6 sm:mb-8 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      animate={{ rotate: playerDetails.length > 1 ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </motion.div>
                    Add Team Member
                  </motion.button>
                )}

                {/* Action Buttons */}
                <div className="pt-4 sm:pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={!selectedEvent || isSubmitting}
                    className="flex-1 p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base lg:text-xl rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 lg:gap-4"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin" />
                        Registering Team...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        Register Team
                      </>
                    )}
                  </motion.button>
                  
                  <Link href="/dashboard/cart">
                    <motion.button 
                      className="w-full sm:w-auto p-4 sm:p-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base lg:text-xl rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      View Cart
                    </motion.button>
                  </Link>
                </div>

                {/* Validation Messages */}
                {playerDetails.length > 0 && selectedEventData.minPlayers && playerDetails.length < selectedEventData.minPlayers && (
                  <motion.p 
                    className="text-amber-600 text-center mt-4 flex items-center justify-center gap-2 bg-amber-50 p-3 rounded-lg text-xs sm:text-sm lg:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-base sm:text-lg lg:text-xl">⚠️</span>
                    Minimum {selectedEventData.minPlayers} players required to register
                  </motion.p>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Display */}
          <AnimatePresence>
            {message && (
              <motion.div 
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mx-2 sm:mx-0 ${message.includes("Error") || message.includes("Please") ? "bg-red-100 text-red-700 border-2 border-red-200" : "bg-green-100 text-green-700 border-2 border-green-200"}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base">
                  {message.includes("Error") || message.includes("Please") ? (
                    <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">❌</span>
                  ) : (
                    <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">✅</span>
                  )}
                  <span className="break-words">{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}