// Types for the getMyEvents API response
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  playerType: string;
  isVerified: string;
  createdAt: Date;
};

export type Event = {
  id: string;
  name: string;
  slug: string;
  venue: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  pricePerPlayer: number | null;
  eventImg: string | null;
  category: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
};

export type AccommodationDetails = {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  maleCount: number | null;
  femaleCount: number | null;
  isAlloted: boolean | null;
};
export type PaymentDetails = {
  id: string;
  amount: number;
  paymentStatus: string; // or restrict to your enum: "PENDING" | "SUCCESS" | "FAILED"
  paymentProofUrl: string | null;
  createdAt: Date;
};
export type Team = {
  id: string;
  eventId: string;
  paymentDetailsId: string | null;
  accommodationPaymentId: string | null;
  Event: Event | null;
  TeamMembers: TeamMember[];
  AccommodationDetails: AccommodationDetails | null;
  PaymentDetails?: PaymentDetails | null; 
};

// Type for getAllEvents API response
export type EventSummary = {
  id: string;
  name: string;
  slug: string;
  venue: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  pricePerPlayer: number | null;
  eventImg: string | null;
  category: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
};