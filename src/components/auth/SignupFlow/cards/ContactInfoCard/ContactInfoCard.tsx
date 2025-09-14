import React, { useState } from "react";
import { SignupData } from "../../SignupFlow";
import "./ContactInfoCard.css";
import { validateEmail } from "../../../../../utils/validation";

interface ContactInfoCardProps {
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

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  loading,
  error,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: "email", value: string) => {
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
    const emailError = validateEmail(data.email);

    const errors: Record<string, string> = {};

    if (!emailError.isValid) {
      errors.email = emailError.error || "";
    }

    setFieldErrors(errors);

    // Only proceed if validation passes
    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="contact-info-card">
      <div className="card-header">
        <h2 className="card-title">Contact Information</h2>
        <p className="card-subtitle">
          We'll use this to send you important updates
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className={`form-input ${fieldErrors.email ? "error" : ""}`}
            placeholder="Enter your email address"
            required
          />
          {fieldErrors.email && (
            <div className="field-error">{fieldErrors.email}</div>
          )}
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

export default ContactInfoCard;
