import React from "react";
import "./SignupHeader.css";

interface SignupHeaderProps {
  onBack: () => void;
  canGoBack: boolean;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({ onBack, canGoBack }) => {
  return (
    <div className="signup-header">
      <button className="back-button" onClick={onBack} disabled={!canGoBack}>
        ←
      </button>
      <div className="logo-section">
        <div className="betwiz-logo">
          <div className="logo-icon">🏆</div>
          <div className="logo-text">BETWIZ</div>
        </div>
      </div>
    </div>
  );
};

export default SignupHeader;
