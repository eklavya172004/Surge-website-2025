import { Building2, CircleDot, Coffee, DoorOpen, Footprints, Goal, Trophy, UtensilsCrossed } from "lucide-react";
import type { CampusPlace } from "./places";

export default function PlaceIcon({ place, size = 18 }: { place: CampusPlace; size?: number }) {
  if (place.id === "isc") return <Building2 size={size} aria-hidden="true" />;
  if (place.id === "athletics") return <Footprints size={size} aria-hidden="true" />;
  if (place.id === "cricket") return <CircleDot size={size} aria-hidden="true" />;
  if (place.id === "football-futsal") return <Goal size={size} aria-hidden="true" />;
  if (place.category === "sports") return <Trophy size={size} aria-hidden="true" />;
  if (place.category === "essentials") return <DoorOpen size={size} aria-hidden="true" />;
  if (place.id === "nescafe" || place.id === "cnd") return <Coffee size={size} aria-hidden="true" />;
  return <UtensilsCrossed size={size} aria-hidden="true" />;
}
