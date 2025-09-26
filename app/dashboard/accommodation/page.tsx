"use client";

import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { Bed, Calendar, Users, CheckCircle, XCircle, CreditCard, X, CalendarDays, UserRound } from "lucide-react";

interface AccommodationProps {
  teamId: string;
  startDate: string;
  endDate: string;
  maleCount: number;
  femaleCount: number;
}

export default function AccommodationPage() {
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
      setIsModalOpen(false);
      setSelectedAccommodation([]); // Clear selection after successful checkout
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setMessage("Error processing payment.");
      setMessageType('error');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-6 h-6 border-3 border-hsl(190, 70%, 50%) border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 flex items-center justify-center" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>Error Loading Teams</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md p-8 rounded-2xl" 
             style={{ 
               background: 'hsl(220, 10%, 11%)',
               border: '1px solid hsl(220, 10%, 16%)'
             }}>
          <Bed className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>No Teams Found</h2>
          <p className="" style={{ color: 'hsl(220, 11%, 35%)' }}>You have not registered for any events yet. Complete your registration first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4" style={{ background: 'hsl(220, 10%, 16%)' }}>
            <Bed className="w-8 h-8" style={{ color: 'hsl(190, 70%, 50%)' }} />
          </div>
        </div>
        <h1 className="text-3xl font-mono mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
          Accommodation
        </h1>
        <p style={{ color: 'hsl(220, 11%, 35%)' }}>Manage your accommodation details for events</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 ${messageType === 'success' ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
          <div className="flex items-center gap-2 font-mono">
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" style={{ color: 'hsl(190, 70%, 50%)' }} />
            ) : (
              <XCircle className="w-5 h-5" style={{ color: 'hsl(340, 80%, 66%)' }} />
            )}
            {message}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {teams.map((team, index) => {
          const teamAccom = accommodation.find(acc => acc.teamId === team.id);
          const teamTotal = teamAccom ? calculateTotal(teamAccom) : 0;
          const days = teamAccom ? calculateDays(teamAccom.startDate, teamAccom.endDate) : 0;

          return (
            <div
              key={team.id}
              className="rounded-xl overflow-hidden"
              style={{ 
                background: 'hsl(220, 10%, 11%)',
                border: '1px solid hsl(220, 10%, 16%)'
              }}
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                style={{ 
                  background: 'linear-gradient(90deg, hsl(220, 10%, 16%), hsl(240, 10%, 20%))',
                }}
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
                    className="w-5 h-5 border-2 rounded-md bg-transparent"
                    style={{ 
                      borderColor: 'hsl(190, 70%, 50%)',
                      background: selectedAccommodation.includes(team.id) ? 'hsl(190, 70%, 50%)' : 'transparent'
                    }}
                    checked={selectedAccommodation.includes(team.id)}
                    onChange={() => handleSelectTeam(team.id)}
                  />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'hsl(220, 45%, 90%)' }}>{team.Event.name}</h3>
                    <div className="flex items-center gap-4 text-sm mt-1">
                      <div className="flex items-center gap-1" style={{ color: 'hsl(220, 30%, 80%)' }}>
                        <Users className="w-4 h-4" style={{ color: 'hsl(279, 80%, 66%)' }} />
                        <span>{team._count.TeamMembers} members</span>
                      </div>
                      {teamTotal > 0 && (
                        <div className="flex items-center gap-1" style={{ color: 'hsl(220, 30%, 80%)' }}>
                          <CreditCard className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                          <span>₹{teamTotal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {days > 0 && (
                      <div className="text-sm" style={{ color: 'hsl(190, 70%, 50%)' }}>{days} day{days > 1 ? 's' : ''}</div>
                    )}
                    {teamAccom?.startDate && teamAccom?.endDate && (
                      <div className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>
                        {new Date(teamAccom.startDate).toLocaleDateString()} - {new Date(teamAccom.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <svg
                    className={`w-6 h-6 transition-transform ${isAccordionOpen.includes(team.id) ? 'rotate-180' : ''}`}
                    style={{ color: 'hsl(220, 45%, 90%)' }}
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

              {isAccordionOpen.includes(team.id) && (
                <div className="p-6" style={{ background: 'hsl(220, 10%, 16%)' }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Date Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
                          <CalendarDays className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 rounded-lg font-mono"
                          style={{
                            background: 'hsl(220, 10%, 20%)',
                            border: '1px solid hsl(220, 10%, 30%)',
                            color: 'hsl(220, 30%, 80%)'
                          }}
                          name="startDate"
                          id={team.id}
                          min="2024-11-14"
                          max="2024-11-17"
                          defaultValue={team.AccommodationDetails?.startDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
                          <CalendarDays className="w-4 h-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 rounded-lg font-mono"
                          style={{
                            background: 'hsl(220, 10%, 20%)',
                            border: '1px solid hsl(220, 10%, 30%)',
                            color: 'hsl(220, 30%, 80%)'
                          }}
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
                          <label className="flex items-center gap-2 text-sm font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
                            <UserRound className="w-4 h-4" style={{ color: 'hsl(240, 80%, 66%)' }} />
                            Male Beds
                          </label>
                          <input
                            type="number"
                            className="w-full p-3 rounded-lg font-mono"
                            style={{
                              background: 'hsl(220, 10%, 20%)',
                              border: '1px solid hsl(220, 10%, 30%)',
                              color: 'hsl(220, 30%, 80%)'
                            }}
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
                          <label className="flex items-center gap-2 text-sm font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>
                            <UserRound className="w-4 h-4" style={{ color: 'hsl(279, 80%, 66%)' }} />
                            Female Beds
                          </label>
                          <input
                            type="number"
                            className="w-full p-3 rounded-lg font-mono"
                            style={{
                              background: 'hsl(220, 10%, 20%)',
                              border: '1px solid hsl(220, 10%, 30%)',
                              color: 'hsl(220, 30%, 80%)'
                            }}
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
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: 'hsl(220, 10%, 30%)' }}>
                    <button
                      className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                      style={{
                        background: 'hsl(190, 70%, 50%)',
                        color: 'white'
                      }}
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
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Checkout Section */}
      <div className="mt-8 rounded-xl p-6" 
           style={{ 
             background: 'hsl(220, 10%, 11%)',
             border: '1px solid hsl(220, 10%, 16%)'
           }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="mb-2" style={{ color: 'hsl(220, 11%, 35%)' }}>Total Amount</p>
            <div className="text-4xl font-bold" style={{ color: 'hsl(190, 70%, 50%)' }}>
              ₹{total.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => {
              if (isNaN(total) || total === 0) {
                setMessage("Save accommodation details before checkout.");
                setMessageType('error');
                return;
              }
              setIsModalOpen(true);
            }}
            disabled={selectedAccommodation.length === 0}
            className={`flex items-center px-8 py-4 rounded-xl font-bold ${selectedAccommodation.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: selectedAccommodation.length === 0 ? 'hsl(220, 10%, 20%)' : 'linear-gradient(135deg, hsl(190, 70%, 50%), hsl(190, 80%, 60%))',
              color: selectedAccommodation.length === 0 ? 'hsl(220, 11%, 35%)' : 'white'
            }}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            <span>Checkout</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-hsl(220, 10%, 16%) to-hsl(240, 10%, 20%) rounded-xl w-full max-w-md p-6 relative border border-hsl(220, 10%, 20%)" 
               style={{ 
                 background: 'linear-gradient(to bottom, hsl(220, 10%, 16%), hsl(240, 10%, 20%))'
               }}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full"
              style={{ color: 'hsl(220, 11%, 35%)' }}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'hsl(220, 45%, 90%)' }}>Complete Payment</h3>
            
            <div className="flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-hsl(220, 10%, 20%) rounded-xl p-4 flex items-center justify-center mb-6">
                <div className="text-lg" style={{ color: 'hsl(220, 30%, 80%)' }}>QR Code Placeholder</div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold my-2" style={{ color: 'hsl(190, 70%, 50%)' }}>Amount: ₹{total}</div>
                <p className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>
                  1. Scan the QR Code using any UPI app<br />
                  2. Make the payment of the amount shown above<br />
                  3. Once the payment is successful, put the UPI transaction ID in the box below and press submit
                </p>
              </div>
              
              <input
                className="w-full p-4 rounded-lg font-mono mb-4"
                style={{
                  background: 'hsl(220, 10%, 20%)',
                  border: '1px solid hsl(220, 10%, 30%)',
                  color: 'hsl(220, 30%, 80%)'
                }}
                placeholder="Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(40, 80%, 50%), hsl(10, 80%, 50%))',
                color: 'white'
              }}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              <span>Finish Payment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}