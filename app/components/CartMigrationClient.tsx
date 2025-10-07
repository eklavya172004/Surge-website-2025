"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";

type OldCartItem = {
  eventId: string;
  slug: string;
  players: {
    name: string;
    email: string;
    rollNumber: string | null;
    phone: string;
  }[];
  accommodation: boolean;
  accommodationDetails?: {
    maleCount: number;
    femaleCount: number;
    startDate?: string;
    endDate?: string;
  };
};

export default function CartMigrationClient() {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "migrating" | "completed" | "error">("idle");
  const migrateCartMutation = trpc.reg.migrateLocalCartToDb.useMutation();

  useEffect(() => {
    // Check if there are any items in localStorage that need to be migrated
    const migrateLocalStorageCart = async () => {
      try {
        const raw = localStorage.getItem("eventCart");
        if (!raw) return;

        const cart: OldCartItem[] = JSON.parse(raw);
        if (!Array.isArray(cart) || cart.length === 0) return;

        setMigrationStatus("migrating");

        // Migrate all items in the cart at once using the new migration API
        const result = await migrateCartMutation.mutateAsync({
          localCart: cart.map(item => ({
            eventId: item.eventId,
            players: item.players.map(player => ({
              name: player.name,
              email: player.email,
              rollNumber: player.rollNumber,
              phone: player.phone,
            }))
          }))
        });

        // Check the results and provide feedback
        const failedMigrations = result.results.filter(r => !r.success);
        if (failedMigrations.length > 0) {
          console.warn("Some cart items failed to migrate:", failedMigrations);
          // Still remove localStorage since successfully migrated items are now in DB
        }

        // Clear localStorage after migration attempt
        localStorage.removeItem("eventCart");
        setMigrationStatus("completed");
      } catch (error) {
        console.error("Error migrating cart from localStorage:", error);
        setMigrationStatus("error");
      }
    };

    migrateLocalStorageCart();
  }, [migrateCartMutation]);

  if (migrationStatus === "migrating") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <p className="text-blue-700 font-medium text-sm">Migrating your old cart items to our new system...</p>
        </div>
      </div>
    );
  }

  if (migrationStatus === "completed") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="h-4 w-4 text-green-500 mr-2">✓</div>
          <p className="text-green-700 font-medium text-sm">Successfully migrated your cart items to our new system!</p>
        </div>
      </div>
    );
  }

  if (migrationStatus === "error") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="h-4 w-4 text-yellow-500 mr-2">⚠</div>
          <p className="text-yellow-700 font-medium text-sm">There was an issue migrating your old cart items. Please re-add them to your cart.</p>
        </div>
      </div>
    );
  }

  return null;
}