import React, { useState } from "react";
import PickCard, { Pick } from "../PickCard";
import BetSuccessScreen from "../BetSuccessScreen/BetSuccessScreen";
import "./FinalizeEntry.css";

interface FinalizeEntryProps {
  selectedPicks: Record<string, "over" | "under">;
  picks: Pick[];
  userBalance: number;
  onBack: () => void;
  onClear: () => void;
  onMakeBet: (wagerAmount: number) => Promise<void>;
  onPickDeselect: (pickId: string) => void;
  onBetSuccess: () => void;
}

const FinalizeEntry: React.FC<FinalizeEntryProps> = ({
  selectedPicks,
  picks,
  userBalance,
  onBack,
  onClear,
  onMakeBet,
  onPickDeselect,
  onBetSuccess,
}) => {
  const [wagerAmount, setWagerAmount] = useState<string>("5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Calculate payout multiplier based on number of picks
  const calculatePayoutMultiplier = (pickCount: number): number => {
    const powerMultipliers: { [key: number]: number } = {
      2: 2.5,
      3: 4,
      4: 8,
      5: 15,
      6: 40,
    };
    return powerMultipliers[pickCount] || 1;
  };

  // Get selected picks data
  const selectedPicksData = picks.filter((pick) => selectedPicks[pick._id]);
  const pickCount = selectedPicksData.length;
  const payoutMultiplier = calculatePayoutMultiplier(pickCount);
  const wagerValue = parseFloat(wagerAmount) || 0;
  const potentialPayout = wagerValue * payoutMultiplier;

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (wagerValue <= 0) {
      setError("Please enter a valid wager amount");
      return;
    }

    if (wagerValue > userBalance) {
      setError("Insufficient balance");
      return;
    }

    if (pickCount < 2 || pickCount > 6) {
      setError("Please select between 2 and 6 picks");
      return;
    }

    setIsSubmitting(true);

    try {
      await onMakeBet(wagerValue);
      setShowSuccessScreen(true);
    } catch (err: any) {
      setError(err.message || "Failed to place bet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessScreen(false);
    onBetSuccess();
  };

  const handleCardClick = (pickId: string) => {
    onPickDeselect(pickId);
  };

  const handleClearAll = () => {
    onClear();
    onBack(); // Go back to dashboard
  };

  const handleWagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string
    if (value === "") {
      setWagerAmount("");
      return;
    }

    // Regex to validate: up to 5 digits before decimal, up to 3 digits after decimal
    const regex = /^\d{0,5}(\.\d{0,3})?$/;

    if (regex.test(value)) {
      setWagerAmount(value);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="finalize-entry-container">
        <div className="finalize-entry-content">
          <div className="section-header">
            <h2>Your Picks ({pickCount})</h2>
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All
            </button>
          </div>

          <div className="selected-picks-section">
            <div className="selected-picks-grid">
              {selectedPicksData.map((pick) => (
                <PickCard
                  key={pick._id}
                  pick={pick}
                  isSelected={true}
                  selectedOption={selectedPicks[pick._id]}
                  onSelect={() => {}}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          {/* Bet Input Section */}
          <div className="bet-input-section">
            <div className="wager-input-group">
              <label htmlFor="wager-amount">Wager Amount</label>
              <div className="input-wrapper">
                <span className="dollar-sign">$</span>
                <input
                  id="wager-amount"
                  type="text"
                  value={wagerAmount}
                  onChange={handleWagerChange}
                  placeholder="5.00"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="payout-info">
              <div className="payout-row">
                <span>Picks:</span>
                <span>{pickCount}</span>
              </div>
              <div className="payout-row">
                <span>Multiplier:</span>
                <span>{payoutMultiplier}x</span>
              </div>
              <div className="payout-row total">
                <span>Potential Payout:</span>
                <span className="payout-amount">
                  ${formatCurrency(potentialPayout)}
                </span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {/* Place Bet Button - Fixed at bottom */}
        <button
          className="place-bet-btn-fixed"
          onClick={handleSubmit}
          disabled={isSubmitting || wagerValue <= 0 || pickCount < 2}>
          {isSubmitting ? "Placing Bet..." : "Place Bet"}
        </button>
      </div>

      {/* Bet Success Screen */}
      {showSuccessScreen && <BetSuccessScreen onClose={handleSuccessClose} />}
    </>
  );
};

export default FinalizeEntry;
