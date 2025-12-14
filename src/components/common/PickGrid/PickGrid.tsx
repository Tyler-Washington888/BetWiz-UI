import React from "react";
import PickCard, { Pick } from "../PickCard";
import "./PickGrid.css";

interface PickGridProps {
  picks: Pick[];
  selectedPicks: Record<string, "over" | "under">;
  onPickSelect: (pickId: string, selection: "over" | "under") => void;
  onCardClick?: (pickId: string) => void;
}

const PickGrid: React.FC<PickGridProps> = ({
  picks,
  selectedPicks,
  onPickSelect,
  onCardClick,
}) => {
  return (
    <div className="pick-grid">
      {picks.map((pick) => (
        <PickCard
          key={pick._id}
          pick={pick}
          isSelected={!!selectedPicks[pick._id]}
          selectedOption={selectedPicks[pick._id] || null}
          onSelect={onPickSelect}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default PickGrid;

