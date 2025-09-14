import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useAuth } from "../../../contexts/AuthContext";
import "./DashboardScreen.css";

const DashboardScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <MainLayout>
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">🏆</div>
              <h1 className="logo-text">BETWIZ</h1>
            </div>
            <div className="user-section">
              <span className="welcome-text">
                Welcome, {currentUser?.firstname}
              </span>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-content">
            <h2>Dashboard</h2>
            <p>Welcome to your BetWiz dashboard!</p>
            <div className="feature-cards">
              <div className="feature-card">
                <h3>Live Betting</h3>
                <p>Place bets on live events</p>
              </div>
              <div className="feature-card">
                <h3>Sports</h3>
                <p>Bet on your favorite sports</p>
              </div>
              <div className="feature-card">
                <h3>History</h3>
                <p>View your betting history</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default DashboardScreen;
