"use client";

import { trpc } from "@/utils/trpc";
import { Calendar, Users, CreditCard, MapPin, UserCheck } from "lucide-react";

interface EventSummary {
  id: string;
  name: string;
  eventImg?: string | null;
  venue?: string | null;
  pricePerPlayer?: number | null;
}

export default function MyEventsPage() {
  const { data: teams, isLoading, error } = trpc.event.getMyEvents.useQuery();
  const { data: allEvents } = trpc.event.getAllEvents.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 py-12" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-3 border-hsl(190, 70%, 50%) border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-mono">Loading your events...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-12" style={{ color: 'hsl(220, 30%, 80%)' }}>
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center">
          <div className="font-mono text-red-400">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  const suggestedEvents: EventSummary[] = (allEvents ?? []).slice(0, 5);

  return (
    <div className="space-y-8 py-8" style={{ color: 'hsl(220, 30%, 80%)' }}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-mono mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
          YOUR EVENTS
        </h1>
        <p style={{ color: 'hsl(220, 11%, 35%)' }}>Manage your registered events and teams</p>
      </div>

      <div className="space-y-8">
        {/* If user has teams, show them in cards. Otherwise show message and suggested events */}
        {teams && teams.length > 0 ? (
          <div className="space-y-6">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="rounded-xl overflow-hidden"
                style={{ 
                  background: 'hsl(220, 10%, 11%)',
                  border: '1px solid hsl(220, 10%, 16%)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/4">
                      <div className="aspect-video rounded-lg overflow-hidden" 
                           style={{ background: 'linear-gradient(135deg, hsl(220, 10%, 20%), hsl(240, 10%, 30%))' }}>
                        {team.Event?.eventImg ? (
                          <img 
                            src={team.Event.eventImg} 
                            alt={team.Event.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl" style={{ color: 'hsl(190, 70%, 50%)' }}>
                            ⚽
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
                            <Calendar className="h-5 w-5" style={{ color: 'hsl(190, 70%, 50%)' }} />
                            {team.Event?.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1" style={{ color: 'hsl(220, 30%, 80%)' }}>
                              <MapPin className="h-4 w-4" style={{ color: 'hsl(279, 80%, 66%)' }} />
                              {team.Event?.venue || "Venue not specified"}
                            </div>
                            <div className="flex items-center gap-1" style={{ color: 'hsl(220, 30%, 80%)' }}>
                              <Users className="h-4 w-4" style={{ color: 'hsl(240, 80%, 66%)' }} />
                              Players: {team.TeamMembers?.length ?? 0}
                            </div>
                            <div className="flex items-center gap-1" style={{ color: 'hsl(220, 30%, 80%)' }}>
                              <CreditCard className="h-4 w-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                              Price: ₹{team.Event?.pricePerPlayer ?? "—"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                          <div className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>Team ID</div>
                          <div className="font-mono text-lg font-bold" style={{ color: 'hsl(190, 70%, 50%)' }}>{team.id}</div>
                          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-mono ${
                            team.paymentDetailsId 
                              ? "bg-green-900/30 text-green-400" 
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}>
                            {team.paymentDetailsId ? "Paid" : "Pending"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-mono mb-3 flex items-center gap-2" style={{ color: 'hsl(220, 45%, 90%)' }}>
                          <UserCheck className="h-4 w-4" style={{ color: 'hsl(190, 70%, 50%)' }} />
                          Team Members
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {team.TeamMembers?.map((member) => (
                            <div 
                              key={member.id} 
                              className="flex items-center justify-between p-3 rounded-lg"
                              style={{ 
                                background: 'hsl(220, 10%, 16%)',
                                border: '1px solid hsl(220, 10%, 20%)'
                              }}
                            >
                              <div>
                                <div className="font-mono" style={{ color: 'hsl(220, 45%, 90%)' }}>{member.name}</div>
                                <div className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>{member.rollNumber}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm" style={{ color: 'hsl(220, 11%, 35%)' }}>{member.phone}</div>
                                {member.isVerified === "VERIFIED" && (
                                  <div className="text-green-400 text-xs flex items-center justify-end gap-1">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(220, 45%, 90%)' }}>No Events Registered Yet</h3>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'hsl(220, 11%, 35%)' }}>
              You haven&apos;t registered for any events yet. Check out our suggested events below or visit the registration page to get started!
            </p>
            
            <a 
              href="/dashboard/register" 
              className="inline-flex items-center px-6 py-3 rounded-xl font-bold"
              style={{
                background: 'hsl(190, 70%, 50%)',
                color: 'white'
              }}
            >
              Register for Events
            </a>
          </div>
        )}

        {/* Suggested events */}
        {(!teams || teams.length === 0) && (
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'hsl(220, 45%, 90%)' }}>Suggested Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-xl overflow-hidden"
                  style={{ 
                    background: 'hsl(220, 10%, 11%)',
                    border: '1px solid hsl(220, 10%, 16%)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {ev.eventImg ? (
                      <img 
                        src={ev.eventImg} 
                        alt={ev.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" 
                           style={{ background: 'linear-gradient(135deg, hsl(220, 10%, 20%), hsl(240, 10%, 30%))' }}>
                        <div className="text-4xl" style={{ color: 'hsl(190, 70%, 50%)' }}>⚽</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg">{ev.name}</h4>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div style={{ color: 'hsl(220, 11%, 35%)' }}>
                        {ev.venue ? ev.venue : "Venue not specified"}
                      </div>
                      <div className="font-mono font-semibold" style={{ color: 'hsl(190, 70%, 50%)' }}>
                        ₹{ev.pricePerPlayer ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}