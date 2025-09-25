"use client";

import React, { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

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
      return;
    }
    const { startDate, endDate, maleCount, femaleCount } = data;

    const accomId = teams?.find((team) => team.id === teamId)?.AccommodationDetails?.id;

    if (!startDate || !endDate || (maleCount === 0 && femaleCount === 0)) {
      setMessage("Enter all details.");
      return;
    }

    if (startDate === endDate) {
      setMessage("Start and end date cannot be the same.");
      return;
    }

    if (startDate > endDate) {
      setMessage("Start date cannot be greater than end date.");
      return;
    }

    if (startDate < "2024-11-14" || endDate > "2024-11-17") {
      setMessage("Invalid date range.");
      return;
    }

    if (maleCount + femaleCount > count) {
      setMessage("Number of beds exceeds team size.");
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
      setMessage("Accommodation details saved.");
      await refetch();
    } catch (_error) {
      setMessage("Error saving accommodation details.");
    }
  };

  const handleCheckout = async () => {
    if (selectedAccommodation.length === 0) {
      setMessage("Select a team to checkout.");
      return;
    }

    if (!transactionId) {
      setMessage("Enter transaction ID.");
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
      setMessage("Payment successful.");
      // Optionally redirect: router.push('/dashboard');
    } catch (_error) {
      setMessage("Error processing payment.");
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading teams.</div>;
  if (!teams || teams.length === 0) return <div className="text-center text-lg">No teams verified yet.</div>;

  return (
    <main className="max-w-4xl mx-auto py-8 px-6 text-white">
      <h2 className="text-4xl mb-8 text-[#F4AC18] font-bold">Accommodation</h2>
      <div className="accordion">
        {teams.map((team) => (
          <div key={team.id} className="accordion-item mb-4">
            <button
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg w-full text-left hover:bg-gray-700 transition-colors"
              onClick={() =>
                setIsAccordionOpen((prev) =>
                  prev.includes(team.id)
                    ? prev.filter((id) => id !== team.id)
                    : [...prev, team.id]
                )
              }
            >
              <div className="flex-1 text-xl text-[#F4AC18] flex items-center">
                <input
                  type="checkbox"
                  className="w-6 h-6 border-2 border-white rounded-md bg-transparent checked:bg-[#F4AC18] checked:border-[#F4AC18] mr-2 cursor-pointer"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3E%3C/svg%3E")',
                  }}
                  checked={selectedAccommodation.includes(team.id)}
                  onChange={() => handleSelectTeam(team.id)}
                />
                {team.Event.name}
              </div>
              <svg
                className={`w-6 h-6 transition-transform ${isAccordionOpen.includes(team.id) ? 'rotate-180' : ''}`}
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
            </button>
            <div className={`${isAccordionOpen.includes(team.id) ? 'block' : 'hidden'} bg-gray-900 p-4 rounded-lg`}>
              <div className="flex flex-col space-y-4">
                <label className="text-white">Start Date</label>
                <input
                  type="date"
                  className="bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-[#F4AC18] focus:ring-2 focus:ring-[#F4AC18]/20"
                  name="startDate"
                  id={team.id}
                  min="2024-11-14"
                  max="2024-11-17"
                  defaultValue={team.AccommodationDetails?.startDate}
                  onChange={handleInputChange}
                />
                <label className="text-white">End Date</label>
                <input
                  type="date"
                  className="bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-[#F4AC18] focus:ring-2 focus:ring-[#F4AC18]/20"
                  name="endDate"
                  id={team.id}
                  min="2024-11-14"
                  max="2024-11-17"
                  defaultValue={team.AccommodationDetails?.endDate}
                  onChange={handleInputChange}
                />
                {fieldDisabled(team.Event.category, "MALE") && (
                  <>
                    <label className="text-white">Male Beds</label>
                    <input
                      type="number"
                      className="bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-[#F4AC18] focus:ring-2 focus:ring-[#F4AC18]/20"
                      name="maleCount"
                      id={team.id}
                      defaultValue={team.AccommodationDetails?.maleCount}
                      onChange={handleInputChange}
                      placeholder="Number of male beds"
                    />
                  </>
                )}
                {fieldDisabled(team.Event.category, "FEMALE") && (
                  <>
                    <label className="text-white">Female Beds</label>
                    <input
                      type="number"
                      className="bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:border-[#F4AC18] focus:ring-2 focus:ring-[#F4AC18]/20"
                      name="femaleCount"
                      id={team.id}
                      defaultValue={team.AccommodationDetails?.femaleCount}
                      onChange={handleInputChange}
                      placeholder="Number of female beds"
                    />
                  </>
                )}
                <hr className="mt-4 border-gray-600" />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  onClick={() =>
                    handleSaveOrUpdate(
                      team.id,
                      !!team.AccommodationDetails,
                      team._count.TeamMembers
                    )
                  }
                >
                  {team.AccommodationDetails ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-row justify-between items-center">
        <span className="text-xl">Total: {total}</span>
        <button
          className={`bg-red-500 text-white px-6 py-3 rounded-md text-lg hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg transition-all ${selectedAccommodation.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (isNaN(total) || total === 0) {
              setMessage("Save accommodation details before checkout.");
              return;
            }
            setIsModalOpen(true);
          }}
          disabled={selectedAccommodation.length === 0}
        >
          Checkout
        </button>
      </div>

      {message && (
        <div className="mt-4 text-center text-red-500">{message}</div>
      )}

      {/* Modal */}
      <div className={`fixed inset-0 bg-black/50 flex justify-center items-center ${isModalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
          <h3 className="text-xl font-bold">Enter Transaction ID</h3>
          <button
            className="absolute top-2 right-2 text-white text-2xl"
            onClick={() => setIsModalOpen(false)}
          >
            &times;
          </button>
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              <img src="/images/qr2.jpg" alt="QR Code" className="w-48 h-48" />
            </div>
            <span className="text-3xl font-bold text-white my-4">Amount: Rs. {total}</span>
            <p className="text-sm text-gray-400 text-left mb-4">
              1. Scan the QR Code using any UPI app <br />
              2. Make the payment of the amount shown above <br />
              3. Once the payment is successful, put the UPI transaction ID in the box below and press submit
            </p>
            <input
              className="bg-gray-900 border border-[#F4AC18] rounded-md p-2 text-white w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#F4AC18]/20"
              placeholder="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-[#F4AC18] text-white px-6 py-3 rounded-md text-lg hover:bg-[#D49516] hover:-translate-y-0.5 hover:shadow-lg transition-all"
              onClick={handleCheckout}
            >
              Finish Payment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Accommodation;