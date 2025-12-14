import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./SignupHeader.css";

interface SignupHeaderProps {
  onBack: () => void;
  canGoBack: boolean;
  showSignIn?: boolean;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({ onBack, canGoBack, showSignIn = false }) => {
  return (
    <div className="signup-header">
      {showSignIn ? (
        <Link to="/login" className="signin-button-header">
          Sign In
        </Link>
      ) : (
        <button className="back-button" onClick={onBack} disabled={!canGoBack}>
          ←
        </button>
      )}
      <div className="logo-section">
        <Logo size="medium" />
      </div>
    </div>
  );
};

export default SignupHeader;
