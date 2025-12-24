import React, { useState } from "react";
import { SignupData } from "../../SignupFlow";
import "./PasswordCard.css";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../../../../utils/validations/authValidation";

interface PasswordCardProps {
  data: SignupData;
  updateData: (field: keyof SignupData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  loading: boolean;
  error: string;
  isBet360Flow?: boolean;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  data,
  updateData,
  onPrev: _onPrev,
  onSubmit,
  loading,
  error,
  isBet360Flow = false,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFieldChange = (
    field: "password" | "confirmPassword",
    value: string
  ) => {
    updateData(field, value);

    
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = () => {
    const passwordError = validatePassword(data.password);
    const confirmPasswordError = validateConfirmPassword(
      data.password,
      data.confirmPassword
    );

    const errors: Record<string, string> = {};

    if (!passwordError.isValid) {
      errors.password = passwordError.error || "";
    }

    if (!confirmPasswordError.isValid) {
      errors.confirmPassword = confirmPasswordError.error || "";
    }

    setFieldErrors(errors);

    
    if (Object.keys(errors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="password-card">
      <div className="card-header">
        <h2 className="card-title">Create Your Password</h2>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              className={`form-input password-input ${
                fieldErrors.password ? "error" : ""
              }`}
              placeholder="Enter your password"
              maxLength={40}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <div className="field-error">{fieldErrors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
              className={`form-input password-input ${
                fieldErrors.confirmPassword ? "error" : ""
              }`}
              placeholder="Confirm your password"
              maxLength={40}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }>
              {showConfirmPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className="field-error">{fieldErrors.confirmPassword}</div>
          )}
        </div>

        <div className="password-requirements-trigger">
          <span
            className="requirements-text"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}>
            Password Requirements
          </span>
          {showTooltip && (
            <div className="requirements-tooltip">
              <h4>Password Requirements:</h4>
              <ul>
                <li>At least 4 characters long</li>
                <li>Maximum 40 characters</li>
                <li>No spaces allowed</li>
              </ul>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="button"
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}>
          {loading 
            ? (isBet360Flow ? "Creating Account & Connecting..." : "Creating Account...") 
            : (isBet360Flow ? "Create Account & Connect to Bet360" : "Create Account")}
        </button>
      </div>
    </div>
  );
};

export default PasswordCard;
