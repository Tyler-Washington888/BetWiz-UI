import React, { useState } from "react";
import { UserAccount } from "../../../contexts/UserContext";
import DepositModal from "../DepositModal/DepositModal";
import Logo from "../Logo/Logo";
import "./HamburgerMenu.css";
import bet360Logo from "../../../assets/bet360-logo.svg";

interface HamburgerMenuProps {
  onClose: () => void;
  onDownloadBet360: () => void;
  onLogout: () => void;
  onDeposit: (amount: number) => void;
  userAccount: UserAccount;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onClose,
  onDownloadBet360,
  onLogout,
  onDeposit,
  userAccount,
}) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const formatBalance = (balance: number): string => {
    return balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="hamburger-overlay" onClick={onClose}>
      <div
        className="hamburger-menu-popup"
        onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Account Balance Card */}
        <div className="balance-card">
          <div className="balance-row">
            <div className="balance-item">
              <span className="balance-label">Credit Balance</span>
              <span className="balance-amount">
                ${formatBalance(userAccount.creditBalance)}
              </span>
            </div>
          </div>
          <button
            className="deposit-btn"
            onClick={() => setIsDepositModalOpen(true)}>
            Deposit
          </button>
        </div>

        {/* Download Bet360 Button - Only show if not linked to Bet360 */}
        {!userAccount.linkedToBet360 && (
          <button className="download-bet360-btn" onClick={onDownloadBet360}>
            <img
              src={bet360Logo}
              alt="Bet360 Logo"
              className="bet360-logo download-bet360-logo"
            />
            <span>Download Bet360</span>
          </button>
        )}

        {/* Footer with Logout and Logo */}
        <div className="menu-footer">
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
          <div className="footer-logo">
            <Logo size="large" variant="horizontal" />
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={onDeposit}
        currentBalance={userAccount.creditBalance}
      />
    </div>
  );
};

export default HamburgerMenu;
