import React from "react";
import Logo from "../Logo/Logo";
import "./NotAvailableMessage.css";

const NotAvailableMessage: React.FC = () => {
  return (
    <div className="not-available-modal-overlay">
      <div className="not-available-modal">
        <div className="modal-content">
          <div className="modal-logo">
            <Logo size="large" variant="vertical" />
          </div>
          <h2 className="modal-title">Mobile Device Friendly</h2>
          <p className="modal-text">
            BetWiz is optimized for mobile and tablet devices only.
          </p>
          <p className="modal-text">
            This app is not supported in the current screen dimensions. Please
            access the app from your mobile device or tablet for the best
            experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAvailableMessage;
