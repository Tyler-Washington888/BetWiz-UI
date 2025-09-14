import React, { useState } from "react";
import { SignupData } from "../../SignupFlow";
import "./BirthdateCard.css";
import { validateDateOfBirth } from "../../../../../utils/validation";

interface BirthdateCardProps {
  data: SignupData;
  updateData: (field: keyof SignupData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  loading: boolean;
  error: string;
}

const BirthdateCard: React.FC<BirthdateCardProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  loading,
  error,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: "dateOfBirth", value: string) => {
    updateData(field, value);

    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNext = () => {
    const dateError = validateDateOfBirth(data.dateOfBirth);

    const errors: Record<string, string> = {};

    if (!dateError.isValid) {
      errors.dateOfBirth = dateError.error || "";
    }

    setFieldErrors(errors);

    // Only proceed if validation passes
    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="birthdate-card">
      <div className="card-header">
        <h2 className="card-title">Date of Birth</h2>
        <p className="card-subtitle">
          You must be 21 or older to create an account
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="dateOfBirth" className="form-label">
            Date of Birth
          </label>
          <input
            type="text"
            id="dateOfBirth"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
            className={`form-input ${fieldErrors.dateOfBirth ? "error" : ""}`}
            placeholder="MM-DD-YYYY (e.g., 01-15-1990)"
            maxLength={10}
            required
          />
          {fieldErrors.dateOfBirth && (
            <div className="field-error">{fieldErrors.dateOfBirth}</div>
          )}
          <div className="input-hint">
            Format: MM-DD-YYYY (e.g., 01-15-1990)
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button
            type="button"
            className="back-button"
            onClick={onPrev}
            disabled={loading}>
            Back
          </button>
          <button
            type="button"
            className="next-button"
            onClick={handleNext}
            disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdateCard;
