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

  const isEnabled =
    selectedPicksCount >= minPicksRequired &&
    selectedPicksCount <= maxPicksAllowed;
  const picksRemaining = minPicksRequired - selectedPicksCount;
  const picksOverLimit = selectedPicksCount - maxPicksAllowed;

  return (
    <div
      className={`finalize-entry-button-container ${
        isEnabled ? "enabled" : "disabled"
      }`}
      onClick={isEnabled ? onFinalizeEntry : undefined}
      style={{ cursor: isEnabled ? "pointer" : "not-allowed" }}
    >
      {isEnabled ? (
        <>
          <span className="button-text">Finalize Bet</span>
          <span className="picks-count">
            {selectedPicksCount} pick{selectedPicksCount !== 1 ? "s" : ""}{" "}
            selected
          </span>
        </>
      ) : selectedPicksCount < minPicksRequired ? (
        <>
          <span className="button-text">
            Select {picksRemaining} More Pick{picksRemaining !== 1 ? "s" : ""}
          </span>
          <span className="picks-count">
            {selectedPicksCount} of {minPicksRequired} selected
          </span>
        </>
      ) : (
        <>
          <span className="button-text">Too Many Picks Selected</span>
          <span className="picks-count">
            Remove {picksOverLimit} pick{picksOverLimit !== 1 ? "s" : ""} (Max{" "}
            {maxPicksAllowed})
          </span>
        </>
      )}
    </div>
  );
};

export default FinalizeEntryButton;


