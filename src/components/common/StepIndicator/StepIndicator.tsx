import React from "react";
import "./StepIndicator.css";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="step-indicator">
      <div className="step-text">
        Step {currentStep + 1} of {totalSteps}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
