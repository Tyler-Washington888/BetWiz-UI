import React from "react";
import Logo from "../Logo/Logo";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  accountBalance: string;
  showBackButton?: boolean;
  onDepositClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuClick,
  accountBalance,
  showBackButton = false,
  onDepositClick,
}) => {
  return (
    <header className="dashboard-header">
      <button className="hamburger-menu" onClick={onMenuClick}>
        {showBackButton ? (
          <span className="back-arrow">←</span>
        ) : (
          <>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </>
        )}
      </button>

      <div className="logo-section">
        <Logo size="medium" variant="horizontal" />
      </div>

      <div className="account-section">
        <span className="account-balance">{accountBalance}</span>
        <button className="add-money-btn" onClick={onDepositClick}>
          <span className="plus-icon">+</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
