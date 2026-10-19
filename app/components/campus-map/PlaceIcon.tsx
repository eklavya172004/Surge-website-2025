import { Coffee, DoorOpen, Trophy, UtensilsCrossed } from "lucide-react";
import type { CampusPlace } from "./places";

export default function PlaceIcon({ place, size = 18 }: { place: CampusPlace; size?: number }) {
  if (place.category === "sports") return <Trophy size={size} aria-hidden="true" />;
  if (place.category === "essentials") return <DoorOpen size={size} aria-hidden="true" />;
  if (place.id === "nescafe" || place.id === "cnd") return <Coffee size={size} aria-hidden="true" />;
  return <UtensilsCrossed size={size} aria-hidden="true" />;
}
