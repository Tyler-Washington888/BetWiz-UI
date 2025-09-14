import React from "react";
import "./SignupCard.css";

interface SignupCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const SignupCard: React.FC<SignupCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="signup-card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default SignupCard;
