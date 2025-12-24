import React, { useState, useEffect } from "react";
import { SignupData } from "../../SignupFlow";
import "./BirthdateCard.css";
import { validateDateOfBirth } from "../../../../../utils/validations/authValidation";

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
  onPrev: _onPrev,
  loading,
  error,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  
  const getDefaultBirthdate = (): string => {
    const today = new Date();
    const twentyOneYearsAgo = new Date(
      today.getFullYear() - 21,
      today.getMonth(),
      today.getDate()
    );
    return twentyOneYearsAgo.toISOString().split("T")[0]; 
  };

  
  useEffect(() => {
    if (!data.dateOfBirth) {
      updateData("dateOfBirth", getDefaultBirthdate());
    }
  }, [data.dateOfBirth, updateData]);

  const handleFieldChange = (field: "dateOfBirth", value: string) => {
    updateData(field, value);

    
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

    
    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="birthdate-card">
      <div className="card-header">
        <h2 className="card-title">Enter Your Date of Birth</h2>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="dateOfBirth" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
            className={`form-input ${fieldErrors.dateOfBirth ? "error" : ""}`}
            style={{
              position: "relative",
              zIndex: 10,
            }}
            required
          />
          {fieldErrors.dateOfBirth && (
            <div className="field-error">{fieldErrors.dateOfBirth}</div>
          )}
          <div className="input-hint">Click to open calendar picker</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="button"
          className="next-button"
          onClick={handleNext}
          disabled={loading}>
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default BirthdateCard;
