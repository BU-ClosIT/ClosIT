"use client";

import React, { useEffect, useState, useMemo } from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import Outfit from "../../model/Outfit";
import PageLayout from "../../components/shared/PageLayout";
import { FirebaseServices } from "../../services/firebase-services";
import { useUser, useUserReady } from "../../components/providers/UserProvider";
import { OutfitCard } from "../../components/cards/OutfitCard";

export default function SavedOutfitsPage() {
  const user = useUser();
  const isReady = useUserReady();

  const [loadingCloset, setLoadingCloset] = useState(true);
  const [userCloset, setUserCloset] = useState<ClosetItem[]>([]);
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);
  const [loadingOutfits, setLoadingOutfits] = useState(true);

  useEffect(() => {
    if (!isReady || !user?.id) return;

    // FETCH CLOSET
    const fetchCloset = async () => {
      setLoadingCloset(true);
      try {
        const response: ClosetItem[] | { items: ClosetItem[] } =
          await FirebaseServices.getClosetByUserId({ userId: user.id });

        if (Array.isArray(response)) setUserCloset(response);
        else if ("items" in response && Array.isArray(response.items))
          setUserCloset(response.items);
        else setUserCloset([]);
      } catch (err) {
        console.error("Error fetching closet:", err);
        setUserCloset([]);
      } finally {
        setLoadingCloset(false);
      }
    };

    // FETCH OUTFITS
    const fetchOutfits = async () => {
      setLoadingOutfits(true);
      try {
        const outfits: { items: Outfit[] } =
          await FirebaseServices.getOutfitsByUserId({
            userId: user.id,
          });

        setUserOutfits(outfits.items);
      } catch (err) {
        console.error("Error fetching outfits:", err);
        setUserOutfits([]);
      } finally {
        setLoadingOutfits(false);
      }
    };

    fetchCloset();
    fetchOutfits();
  }, [isReady, user?.id]);

  const closetMap = useMemo(() => {
    const map: Record<string, ClosetItem> = {};
    for (const item of userCloset) map[item.id] = item;
    return map;
  }, [userCloset]);

  return (
    <PageLayout currentPage="Saved Outfits">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold">Saved Outfits</h1>
      </div>

      {!user ? (
        <div className="mt-4 text-center">
          Please log in to view your saved outfits.
        </div>
      ) : (
        <div className="w-full mt-6 flex flex-wrap gap-6 justify-center">
          {loadingCloset || loadingOutfits ? (
            <div className="text-center w-full">Loading...</div>
          ) : userOutfits.length === 0 ? (
            <div className="text-center w-full">No saved outfits yet.</div>
          ) : (
            userOutfits.map((outfit) => (
              <div key={outfit.id} className="flex-shrink-0 w-full xl:w-[40%]">
                <OutfitCard outfit={outfit} closetMap={closetMap} />
              </div>
            ))
          )}
        </div>
      )}
    </PageLayout>
  );
}
