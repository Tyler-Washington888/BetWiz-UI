import React from "react";
import "./ProgressIndicator.css";

export interface ProgressStep {
  id: string;
  title: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`progress-step ${index <= currentStep ? "active" : ""} ${
            index === currentStep ? "current" : ""
          }`}>
          <div className="step-number">{index + 1}</div>
          <div className="step-title">{step.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
