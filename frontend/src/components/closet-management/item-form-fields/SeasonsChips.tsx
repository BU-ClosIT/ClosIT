import React, { useState } from "react";
import ClosetItem from "../../../model/closet/ClosetItem";
import Season from "../../../model/closet/Seasons";

export function SeasonChip({
  season,
  toggleSeason,
  isActive,
}: {
  season: Season;
  toggleSeason: (season: Season) => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={() => toggleSeason(season)}
      className={`px-2 py-1 border rounded-full ${
        isActive ? "bg-blue-500 text-white" : "bg-white text-black"
      }`}
    >
      {season}
    </button>
  );
}

export default function SeasonsChips({
  selectedItem,
  onChange,
}: {
  selectedItem: ClosetItem;
  onChange: (field: keyof ClosetItem, value: string | string[]) => void;
}) {
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const seasons: Season[] = ["Spring", "Summer", "Fall", "Winter"];

  const toggleSeason = (season: Season) => {
    let updatedSeasons: Season[] = [];
    if (selectedSeasons.includes(season)) {
      updatedSeasons = selectedSeasons.filter((s) => s !== season);
    } else {
      updatedSeasons = [...selectedSeasons, season];
    }
    setSelectedSeasons(updatedSeasons);

    updateItemSeasons();
  };

  const updateItemSeasons = () => {
    onChange("seasons", selectedSeasons);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {seasons.map((season) => (
        <SeasonChip
          key={season}
          season={season}
          toggleSeason={toggleSeason}
          isActive={selectedSeasons.includes(season)}
        />
      ))}
    </div>
  );
}
