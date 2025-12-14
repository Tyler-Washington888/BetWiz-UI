import React from "react";
import "./FinalizeEntryButton.css";

interface FinalizeEntryButtonProps {
  selectedPicksCount: number;
  minPicksRequired: number;
  maxPicksAllowed: number;
  isVisible: boolean;
  onFinalizeEntry?: () => void;
}

const FinalizeEntryButton: React.FC<FinalizeEntryButtonProps> = ({
  selectedPicksCount,
  minPicksRequired,
  maxPicksAllowed,
  isVisible,
  onFinalizeEntry,
}) => {
  if (!isVisible) return null;

  const canFinalize =
    selectedPicksCount >= minPicksRequired &&
    selectedPicksCount <= maxPicksAllowed;

  return (
    <div className="finalize-entry-button-container">
      <button
        className={`finalize-entry-button ${canFinalize ? "enabled" : "disabled"}`}
        disabled={!canFinalize}
        onClick={onFinalizeEntry}
      >
        {canFinalize
          ? "Finalize Entry"
          : `Select ${Math.max(0, minPicksRequired - selectedPicksCount)} more`}
      </button>
    </div>
  );
};

export default FinalizeEntryButton;


