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
    <div className="flex items-center justify-center min-h-96">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-700 text-lg font-medium">Loading your events...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-600 font-medium">Error: {error.message}</div>
    </div>
  );

  const suggestedEvents: EventSummary[] = (allEvents ?? []).slice(0, 5);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          YOUR EVENTS
        </h1>
        <p className="text-slate-600">Manage your registered events and teams</p>
      </motion.div>

      <div className="space-y-8">
        {/* If user has teams, show them in cards. Otherwise show message and suggested events */}
        {teams && teams.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-indigo-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/4">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        {team.Event?.eventImg ? (
                          <Image 
                            src={team.Event.eventImg} 
                            alt={team.Event.name} 
                            width={300} 
                            height={200} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-indigo-500 text-4xl">⚽</div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                            {team.Event?.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {team.Event?.venue || "Venue not specified"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Players: {team.TeamMembers?.length ?? 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              Price: ₹{team.Event?.pricePerPlayer ?? "—"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                          <div className="text-sm text-slate-500 mb-1">Team ID</div>
                          <div className="font-mono text-lg font-bold text-indigo-600">{team.id}</div>
                          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                            team.paymentDetailsId 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {team.paymentDetailsId ? "Paid" : "Pending"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Team Members
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {team.TeamMembers?.map((member) => (
                            <div 
                              key={member.id} 
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <div>
                                <div className="font-medium text-slate-800">{member.name}</div>
                                <div className="text-sm text-slate-600">{member.rollNumber}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-600">{member.phone}</div>
                                {member.isVerified === "VERIFIED" && (
                                  <div className="text-green-600 text-xs flex items-center justify-end gap-1">
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
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Events Registered Yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven{`'`}t registered for any events yet. Check out our suggested events below or visit the registration page to get started!
            </p>
            
            <a 
              href="/dashboard/register" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
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
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Suggested Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedEvents.map((ev, index) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    {ev.eventImg ? (
                      <Image 
                        src={ev.eventImg} 
                        alt={ev.name} 
                        width={300} 
                        height={200} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="text-indigo-500 text-4xl">⚽</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg">{ev.name}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-slate-600">
                        {ev.venue ? ev.venue : "Venue not specified"}
                      </div>
                      <div className="font-semibold text-indigo-600">
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
  );
}
