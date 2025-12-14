import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DepositModal.css";
import { makeDeposit } from "../../../services/depositApi";
import { useUser } from "../../../contexts/UserContext";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  currentBalance?: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
}) => {
  const [amount, setAmount] = useState("10.00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateBalance, userAccount } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (depositAmount <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await makeDeposit(depositAmount);

      if (result.success) {
        // Update balance instantly in the UI
        if (userAccount && result.newBalance !== undefined) {
          updateBalance(result.newBalance);
        }

        onDeposit(depositAmount);
        onClose();
        // Navigate to dashboard after successful deposit
        navigate("/dashboard");
      } else {
        setError(result.message || "Deposit failed");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      setError("Failed to process deposit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Check if it's a valid number format
    if (/^\d*\.?\d*$/.test(cleanValue)) {
      // Split by decimal point to check length restrictions
      const parts = cleanValue.split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1] || "";

      // Max 5 digits before decimal, max 3 digits after decimal
      if (integerPart.length <= 5 && decimalPart.length <= 3) {
        setAmount(cleanValue);
      }
    }
  };

  const formatDepositAmount = (value: string): string => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <button className="deposit-back-btn" onClick={onClose}>
            ←
          </button>
          <div className="deposit-logo">
            <img
              src="/src/assets/betwiz-horizontal-logo.svg"
              alt="BETWIZ"
              className="betwiz-horizontal-logo"
            />
          </div>
        </div>

        <div className="deposit-content">
          <label className="deposit-label">Deposit Amount</label>
          <div className="deposit-input-container">
            <span className="dollar-sign">$</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="deposit-input"
              placeholder="10.00"
            />
          </div>

          {error && <div className="deposit-error">{error}</div>}

          <button
            type="button"
            className="deposit-submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Processing...
              </>
            ) : (
              `Deposit $${formatDepositAmount(amount)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
