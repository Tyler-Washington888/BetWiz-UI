import React from "react";
import "./Bet360Banner.css";
import bet360Logo from "../../../assets/bet360-logo.svg";

interface Bet360BannerProps {
  onDownloadBet360: () => void;
}

const Bet360Banner: React.FC<Bet360BannerProps> = ({ onDownloadBet360 }) => {
  return (
    <div className="bet360-banner" onClick={onDownloadBet360}>
      <div className="bet360-banner-content">
        <div className="bet360-banner-text">
          <p>Click to download Bet360 &</p>
          <p>create your first group chat</p>
          <p>to receive $20 here</p>
          <p>on BetWiz</p>
        </div>
        <div className="bet360-banner-logo">
          <img src={bet360Logo} alt="Bet360 Logo" className="bet360-logo" />
        </div>
      </div>
    </div>
  );
};

export default Bet360Banner;
