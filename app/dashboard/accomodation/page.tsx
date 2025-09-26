"use client";

import React, { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Calendar, Users, CheckCircle, XCircle, ShoppingBag, CreditCard, X, CalendarDays, UserRound } from "lucide-react";

interface AccommodationProps {
  teamId: string;
  startDate: string;
  endDate: string;
  maleCount: number;
  femaleCount: number;
}

const Accommodation: React.FC = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState<AccommodationProps[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const { data: teams, isLoading, isError, refetch } = trpc.accommodation.getAccomodationTeams.useQuery();
  const saveAccom = trpc.accommodation.saveAccommodationDetails.useMutation();
  const accomCheckout = trpc.accommodation.accommodationCheckout.useMutation();

  useEffect(() => {
    if (teams) {
      const initialAccommodation = teams.map((team) => ({
        teamId: team.id,
        startDate: team.AccommodationDetails?.startDate ?? '',
        endDate: team.AccommodationDetails?.endDate ?? '',
        maleCount: team.AccommodationDetails?.maleCount ?? 0,
        femaleCount: team.AccommodationDetails?.femaleCount ?? 0,
      }));
      setAccommodation(initialAccommodation);
    }
  }, [teams]);

  const rates = {
    1: 500,
    2: 800,
    3: 1000,
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays as 1 | 2 | 3;
  };

  const calculateTotal = (data: AccommodationProps) => {
    const days = calculateDays(data.startDate, data.endDate);
    const maleTotal = data.maleCount * rates[days];
    const femaleTotal = data.femaleCount * rates[days];
    return maleTotal + femaleTotal;
  };

  const selectedTeams = teams?.filter((team) => selectedAccommodation.includes(team.id)) || [];
  const total = selectedTeams.reduce((acc, team) => {
    const data = accommodation.find((acc) => acc.teamId === team.id);
    if (!data) return acc;
    return acc + calculateTotal(data);
  }, 0);

  const handleSelectTeam = (id: string) => {
    setSelectedAccommodation((prev) =>
      prev.includes(id) ? prev.filter((teamId) => teamId !== id) : [...prev, id]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id, type } = e.target;
    setAccommodation((prevAccommodation) => {
      const index = prevAccommodation.findIndex((acc) => acc.teamId === id);
      if (index === -1) {
        return [
          ...prevAccommodation,
          {
            teamId: id,
            startDate: '',
            endDate: '',
            maleCount: 0,
            femaleCount: 0,
            [name]: type === 'number' ? parseInt(value) : value,
          },
        ];
      } else {
        const updatedAccommodation = [...prevAccommodation];
        updatedAccommodation[index] = {
          ...updatedAccommodation[index]!,
          [name]: type === 'number' ? parseInt(value) : value,
        };
        return updatedAccommodation;
      }
    });
  };

  const fieldDisabled = (category: string, field: string) => {
    return category === field ? true : category === "MIXED" ? true : false;
  };

  const handleSaveOrUpdate = async (teamId: string, isUpdate: boolean, count: number) => {
    const data = accommodation.find((acc) => acc.teamId === teamId);
    if (!data) {
      setMessage("Enter accommodation details.");
      setMessageType('error');
      return;
    }
    const { startDate, endDate, maleCount, femaleCount } = data;

    const accomId = teams?.find((team) => team.id === teamId)?.AccommodationDetails?.id;

    if (!startDate || !endDate || (maleCount === 0 && femaleCount === 0)) {
      setMessage("Enter all details.");
      setMessageType('error');
      return;
    }

    if (startDate === endDate) {
      setMessage("Start and end date cannot be the same.");
      setMessageType('error');
      return;
    }

    if (startDate > endDate) {
      setMessage("Start date cannot be greater than end date.");
      setMessageType('error');
      return;
    }

    if (startDate < "2024-11-14" || endDate > "2024-11-17") {
      setMessage("Invalid date range.");
      setMessageType('error');
      return;
    }

    if (maleCount + femaleCount > count) {
      setMessage("Number of beds exceeds team size.");
      setMessageType('error');
      return;
    }

    const payload = {
      teamId,
      startDate,
      endDate,
      maleCount,
      femaleCount,
      isUpdate,
      accomId,
    };

    try {
      await saveAccom.mutateAsync(payload);
      setMessage("Accommodation details saved successfully!");
      setMessageType('success');
      await refetch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setMessage("Error saving accommodation details.");
      setMessageType('error');
    }
  };

  const handleCheckout = async () => {
    if (selectedAccommodation.length === 0) {
      setMessage("Select a team to checkout.");
      setMessageType('error');
      return;
    }

    if (!transactionId) {
      setMessage("Enter transaction ID.");
      setMessageType('error');
      return;
    }

    const confirmed = window.confirm("Are you sure you want to checkout? Once checked out, the data cannot be modified.");
    if (!confirmed) return;

    const payload = {
      teamIds: selectedAccommodation,
      accomDetailsIds: selectedTeams.map((team) => team.AccommodationDetails?.id ?? ""),
      amount: total,
      transactionId,
    };

    try {
      await accomCheckout.mutateAsync(payload);
      setMessage("Payment successful!");
      setMessageType('success');
      // Optionally redirect: router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setMessage("Error processing payment.");
      setMessageType('error');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">
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
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
            <p className="text-white font-medium">Loading accommodation details...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center py-20"
        >
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Teams</h2>
            <p className="text-gray-300">Please try refreshing the page</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (!teams || teams.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <Bed className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Teams Found</h2>
          <p className="text-gray-300">You have not registered for any events yet. Complete your registration first.</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.main 
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
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
              className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg"
            >
              <Bed className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-2">
            Accommodation
          </h1>
          <p className="text-gray-300">Manage your accommodation details for events</p>
        </motion.div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div 
              className={`p-4 rounded-2xl shadow-lg mb-6 ${
                messageType === 'success' 
                  ? "bg-green-100 text-green-700 border-2 border-green-200" 
                  : "bg-red-100 text-red-700 border-2 border-red-200"
              }`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 font-semibold">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                {message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {teams.map((team, index) => {
            const teamAccom = accommodation.find(acc => acc.teamId === team.id);
            const teamTotal = teamAccom ? calculateTotal(teamAccom) : 0;
            const days = teamAccom ? calculateDays(teamAccom.startDate, teamAccom.endDate) : 0;

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 transition-all duration-300"
                  onClick={() =>
                    setIsAccordionOpen((prev) =>
                      prev.includes(team.id)
                        ? prev.filter((id) => id !== team.id)
                        : [...prev, team.id]
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-2 border-indigo-400 rounded-md bg-transparent checked:bg-indigo-500 checked:border-indigo-500 mr-3 cursor-pointer"
                      checked={selectedAccommodation.includes(team.id)}
                      onChange={() => handleSelectTeam(team.id)}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{team.Event.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{team._count.TeamMembers} members</span>
                        </div>
                        {teamTotal > 0 && (
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            <span>₹{teamTotal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {days > 0 && (
                        <div className="text-indigo-300 text-sm">{days} day{days > 1 ? 's' : ''}</div>
                      )}
                      {teamAccom?.startDate && teamAccom?.endDate && (
                        <div className="text-gray-300 text-sm">
                          {new Date(teamAccom.startDate).toLocaleDateString()} - {new Date(teamAccom.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <svg
                      className={`w-6 h-6 text-white transition-transform ${isAccordionOpen.includes(team.id) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {isAccordionOpen.includes(team.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-white/5"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Date Inputs */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                              <CalendarDays className="w-4 h-4 text-indigo-400" />
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="w-full p-3 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              name="startDate"
                              id={team.id}
                              min="2024-11-14"
                              max="2024-11-17"
                              defaultValue={team.AccommodationDetails?.startDate}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                              <CalendarDays className="w-4 h-4 text-indigo-400" />
                              End Date
                            </label>
                            <input
                              type="date"
                              className="w-full p-3 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              name="endDate"
                              id={team.id}
                              min="2024-11-14"
                              max="2024-11-17"
                              defaultValue={team.AccommodationDetails?.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        {/* Beds Inputs */}
                        <div className="space-y-4">
                          {fieldDisabled(team.Event.category, "MALE") && (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                <UserRound className="w-4 h-4 text-blue-400" />
                                Male Beds
                              </label>
                              <input
                                type="number"
                                className="w-full p-3 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                                name="maleCount"
                                id={team.id}
                                min="0"
                                defaultValue={team.AccommodationDetails?.maleCount}
                                onChange={handleInputChange}
                                placeholder="Number of male beds"
                              />
                            </div>
                          )}
                          {fieldDisabled(team.Event.category, "FEMALE") && (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                <UserRound className="w-4 h-4 text-pink-400" />
                                Female Beds
                              </label>
                              <input
                                type="number"
                                className="w-full p-3 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                                name="femaleCount"
                                id={team.id}
                                min="0"
                                defaultValue={team.AccommodationDetails?.femaleCount}
                                onChange={handleInputChange}
                                placeholder="Number of female beds"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <button
                          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                          onClick={() =>
                            handleSaveOrUpdate(
                              team.id,
                              !!team.AccommodationDetails,
                              team._count.TeamMembers
                            )
                          }
                        >
                          <CheckCircle className="w-5 h-5" />
                          {team.AccommodationDetails ? 'Update Details' : 'Save Details'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Checkout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-gray-300 mb-2">Total Amount</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
              >
                ₹{total.toLocaleString()}
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isNaN(total) || total === 0) {
                  setMessage("Save accommodation details before checkout.");
                  setMessageType('error');
                  return;
                }
                setIsModalOpen(true);
              }}
              disabled={selectedAccommodation.length === 0}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                selectedAccommodation.length === 0
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-xl'
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              <span>Checkout</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl w-full max-w-md p-6 relative border border-white/20 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">Complete Payment</h3>
              
              <div className="flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-xl p-4 flex items-center justify-center mb-6">
                  <Image 
                    src="/images/qr2.jpg" 
                    alt="QR Code" 
                    width={192} 
                    height={192} 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white my-2">Amount: ₹{total}</div>
                  <p className="text-gray-300 text-sm">
                    1. Scan the QR Code using any UPI app<br />
                    2. Make the payment of the amount shown above<br />
                    3. Once the payment is successful, put the UPI transaction ID in the box below and press submit
                  </p>
                </div>
                
                <input
                  className="w-full p-4 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 mb-4"
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Finish Payment</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default Accommodation;