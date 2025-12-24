import React, { useState, useEffect } from "react";
import Bet360Banner from "../Bet360Banner/Bet360Banner";
import "./BetSuccessScreen.css";

interface BetSuccessScreenProps {
  onClose: () => void;
}

const BetSuccessScreen: React.FC<BetSuccessScreenProps> = ({ onClose }) => {
  const [showToast, setShowToast] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    
    const bannerTimer = setTimeout(() => {
      setShowBanner(true);
    }, 500);

    
    const toastTimer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearTimeout(bannerTimer);
      clearTimeout(toastTimer);
    };
  }, []);

  const handleBet360Click = () => {
    window.open("https://bet360.com", "_blank");
  };

  return (
    <div className="bet-success-overlay">
      {showToast && (
        <div className="success-toast">
          <div className="toast-content">
            <span className="success-icon">✓</span>
            <span className="success-message">Bet placed successfully!</span>
          </div>
        </div>
      )}

      {showBanner && (
        <div className="banner-container">
          <Bet360Banner onDownloadBet360={handleBet360Click} />
          <button className="close-banner-button" onClick={onClose}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default BetSuccessScreen;
