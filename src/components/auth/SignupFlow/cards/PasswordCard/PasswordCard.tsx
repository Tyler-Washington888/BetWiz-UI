import React, { useState } from "react";
import { SignupData } from "../../SignupFlow";
import "./PasswordCard.css";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../../../../utils/validation";

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
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  data,
  updateData,
  onPrev,
  onSubmit,
  loading,
  error,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (
    field: "password" | "confirmPassword",
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

    // Only proceed if validation passes
    if (Object.keys(errors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="password-card">
      <div className="card-header">
        <h2 className="card-title">Create Password</h2>
        <p className="card-subtitle">
          Choose a secure password for your account
        </p>
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
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? "🙈" : "👁️"}
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
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className="field-error">{fieldErrors.confirmPassword}</div>
          )}
        </div>

        <div className="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least 4 characters long</li>
            <li>Maximum 40 characters</li>
            <li>No spaces allowed</li>
          </ul>
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
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordCard;
