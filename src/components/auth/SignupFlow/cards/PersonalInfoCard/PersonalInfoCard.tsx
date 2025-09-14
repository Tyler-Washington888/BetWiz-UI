import React, { useState } from "react";
import { SignupData } from "../../SignupFlow";
import "./PersonalInfoCard.css";
import {
  validateFirstName,
  validateLastName,
} from "../../../../../utils/validation";

interface PersonalInfoCardProps {
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

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  data,
  updateData,
  onNext,
  loading,
  error,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (
    field: "firstname" | "lastname",
    value: string
  ) => {
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
    const firstnameError = validateFirstName(data.firstname);
    const lastnameError = validateLastName(data.lastname);

    const errors: Record<string, string> = {};

    if (!firstnameError.isValid) {
      errors.firstname = firstnameError.error || "";
    }

    if (!lastnameError.isValid) {
      errors.lastname = lastnameError.error || "";
    }

    setFieldErrors(errors);

    // Only proceed if validation passes
    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="personal-info-card">
      <div className="card-header">
        <div className="logo-section">
          <div className="betwiz-logo">
            <div className="logo-icon">🏆</div>
            <h1 className="logo-text">BETWIZ</h1>
          </div>
        </div>
        <h2 className="card-title">Personal Information</h2>
        <p className="card-subtitle">Tell us your name to get started</p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={data.firstname}
            onChange={(e) => handleFieldChange("firstname", e.target.value)}
            className={`form-input ${fieldErrors.firstname ? "error" : ""}`}
            placeholder="Enter your first name"
            required
          />
          {fieldErrors.firstname && (
            <div className="field-error">{fieldErrors.firstname}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={data.lastname}
            onChange={(e) => handleFieldChange("lastname", e.target.value)}
            className={`form-input ${fieldErrors.lastname ? "error" : ""}`}
            placeholder="Enter your last name"
            required
          />
          {fieldErrors.lastname && (
            <div className="field-error">{fieldErrors.lastname}</div>
          )}
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

export default PersonalInfoCard;
