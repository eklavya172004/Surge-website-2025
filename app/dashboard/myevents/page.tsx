"use client";
import React from "react";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users, CreditCard, MapPin, UserCheck } from "lucide-react";

interface EventSummary {
  id: string;
  name: string;
  eventImg?: string | null;
  venue?: string | null;
  pricePerPlayer?: number | null;
}

export default function MyEventsClient() {
  const { data: teams, isLoading, error } = trpc.event.getMyEvents.useQuery();
  const { data: allEvents } = trpc.event.getAllEvents.useQuery();

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-700 text-lg font-medium">Loading your events...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md w-full">
        <div className="text-red-600 font-medium">Error: {error.message}</div>
      </div>
    </div>
  );

  const suggestedEvents: EventSummary[] = (allEvents ?? []).slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-3 sm:p-4 lg:p-6 space-y-6 sm:space-y-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            YOUR EVENTS
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">Manage your registered events and teams</p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {/* If user has teams, show them in cards. Otherwise show message and suggested events */}
          {teams && teams.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      <div className="w-full lg:w-1/4">
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {team.Event?.eventImg ? (
                            <Image 
                              src={team.Event.eventImg} 
                              alt={team.Event.name} 
                              width={300} 
                              height={200} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-2xl sm:text-4xl">⚽</div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 flex items-start gap-2">
                                <Calendar className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                <span className="break-words">{team.Event?.name}</span>
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span className="break-words">{team.Event?.venue || "Venue not specified"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 flex-shrink-0" />
                                  <span>Players: {team.TeamMembers?.length ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                                  <span>Price: ₹{team.Event?.pricePerPlayer ?? "—"}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                              <div className="flex flex-col items-start sm:items-end">
                                <div className="text-xs sm:text-sm text-slate-500 mb-1">Team ID</div>
                                <div className="font-mono text-sm sm:text-lg font-bold text-indigo-600 break-all">{team.id}</div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                team.paymentDetailsId 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {team.paymentDetailsId ? "Paid" : "Pending"}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 sm:mt-6">
                            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm sm:text-base">
                              <UserCheck className="h-4 w-4" />
                              Team Members
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {team.TeamMembers?.map((member) => (
                                <div 
                                  key={member.id} 
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 gap-2 sm:gap-0"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-800 text-sm sm:text-base break-words">{member.name}</div>
                                    <div className="text-xs sm:text-sm text-slate-600 break-words">{member.rollNumber}</div>
                                  </div>
                                  <div className="flex flex-col sm:text-right">
                                    <div className="text-xs sm:text-sm text-slate-600 break-words">{member.phone}</div>
                                    {member.isVerified === "VERIFIED" && (
                                      <div className="text-green-600 text-xs flex items-center sm:justify-end gap-1 mt-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Verified
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-8 sm:py-12 px-4"
            >
              <div className="text-4xl sm:text-6xl mb-4">🎉</div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">No Events Registered Yet</h3>
              <p className="text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                You haven&apos;t registered for any events yet. Check out our suggested events below or visit the registration page to get started!
              </p>
              
              <a 
                href="/dashboard/register" 
                className="inline-flex items-center px-4 sm:px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Register for Events
              </a>
            </motion.div>
          )}

          {/* Suggested events */}
          {(!teams || teams.length === 0) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-2"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Suggested Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {suggestedEvents.map((ev, index) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
                  >
                    <div className="relative h-32 sm:h-48 overflow-hidden">
                      {ev.eventImg ? (
                        <Image 
                          src={ev.eventImg} 
                          alt={ev.name} 
                          width={300} 
                          height={200} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-gray-400 text-2xl sm:text-4xl">⚽</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                        <h4 className="text-white font-bold text-sm sm:text-lg break-words">{ev.name}</h4>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-slate-600 text-xs sm:text-sm break-words flex-1">
                          {ev.venue ? ev.venue : "Venue not specified"}
                        </div>
                        <div className="font-semibold text-indigo-600 text-sm sm:text-base flex-shrink-0">
                          ₹{ev.pricePerPlayer ?? "—"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}