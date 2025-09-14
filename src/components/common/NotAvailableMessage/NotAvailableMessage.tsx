import React from "react";
import "./NotAvailableMessage.css";

const NotAvailableMessage: React.FC = () => {
  return (
    <div className="not-available-message">
      <h2>Desktop Not Available</h2>
      <p>BetWiz is currently optimized for mobile and tablet devices only.</p>
      <p>
        Please access the app from your mobile device or tablet for the best
        experience.
      </p>
      <div className="device-icons">
        <div className="device-icon">📱</div>
        <div className="device-icon">📱</div>
      </div>
    </div>
  );
};

export default NotAvailableMessage;
