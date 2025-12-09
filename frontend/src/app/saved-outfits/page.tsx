"use client";

import React, { useEffect, useState, useMemo } from "react";
import ClosetItem from "../../model/closet/ClosetItem";
import Outfit from "../../model/Outfit";
import PageLayout from "../../components/shared/PageLayout";
import { FirebaseServices } from "../../services/firebase-services";
import { useUser, useUserReady } from "../../components/providers/UserProvider";
import { OutfitCard } from "../../components/cards/OutfitCard";

const sampleOutfits: Outfit[] = [
  {
    id: "outfit-1",
    name: "Sample Outfit 1",
    desc: "sample 1",
    itemIds: [
      "-OeOb2N1Xlp7Sf0wlYo5",
      "-OeOlgbQ1QSbFg6Wk6Zb",
      "-OesEcXxDZ1JHWSbEsEp",
      "-OesFgahcq7NHgHoZCN7",
      "-OesKG599vH_FqGWWInq",
    ],
  },
  {
    id: "outfit-2",
    name: "Sample Outfit 2",
    desc: "outfit 2 desc",
    itemIds: [
      "-OesLGT5_R72xYqlsHXh",
      "-OexiWas3PnyfCkyEQNc",
      "-Oexij2fHCMpV9IaTQr3",
      "-OeOb2N1Xlp7Sf0wlYo5",
      "-OesEcXxDZ1JHWSbEsEp",
      "-OesKG599vH_FqGWWInq",
    ],
  },
  {
    id: "outfit-3",
    name: "Sample Outfit 3",
    desc: "fit3desc",
    itemIds: [
      "-OesLGT5_R72xYqlsHXh",
      "-OexiWas3PnyfCkyEQNc",
      "-Oexij2fHCMpV9IaTQr3",
      "-OesFgahcq7NHgHoZCN7",
    ],
  },
  {
    id: "outfit-4",
    name: "Sample Outfit 4",
    desc: "samplefit 4",
    itemIds: [
      "-OeOlgbQ1QSbFg6Wk6Zb",
      "-OexiWas3PnyfCkyEQNc",
      "-OesKG599vH_FqGWWInq",
      "-Oexij2fHCMpV9IaTQr3",
    ],
  },
];

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

    // Load sample outfits for demo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    setUserOutfits(sampleOutfits);
    setLoadingOutfits(false);
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
