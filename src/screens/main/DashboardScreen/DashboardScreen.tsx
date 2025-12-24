import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardHeader from "../../../components/common/DashboardHeader/DashboardHeader";
import HamburgerMenu from "../../../components/common/HamburgerMenu/HamburgerMenu";
import Bet360Banner from "../../../components/common/Bet360Banner/Bet360Banner";
import PickGrid from "../../../components/common/PickGrid/PickGrid";
import FinalizeEntryButton from "../../../components/common/FinalizeEntryButton";
import FinalizeEntry from "../../../components/common/FinalizeEntry";
import DepositModal from "../../../components/common/DepositModal";
import { getAvailablePicks } from "../../../services/pickApi";
import { Pick } from "../../../components/common/PickCard";
import { createEntry } from "../../../services/entryApi";
import "./DashboardScreen.css";

const DashboardScreen: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [selectedPicks, setSelectedPicks] = useState<
    Record<string, "over" | "under">
  >({});
  const [picksLoading, setPicksLoading] = useState(false);
  const [picksError, setPicksError] = useState<string | null>(null);
  const { userAccount, loading, error, refreshAccount } = useUser();
  const [isReadyToFinalize, setIsReadyToFinalize] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDownloadBet360 = () => {
    window.open("https://bet360.com", "_blank");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeposit = (_amount: number) => {
    
  };

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const handleFinalizeEntry = () => {
    setIsReadyToFinalize(true);
  };

  const handleBackToDashboard = () => {
    setIsReadyToFinalize(false);
  };

  const handleClearPicks = () => {
    setSelectedPicks({});
  };

  const handlePickDeselect = (pickId: string) => {
    if (Object.keys(selectedPicks).length === 2) {
      setIsReadyToFinalize(false);
    }
    setSelectedPicks((prev) => {
      const newSelectedPicks = { ...prev };
      delete newSelectedPicks[pickId];
      return newSelectedPicks;
    });
  };

  const handleMakeBet = async (wagerAmount: number) => {
    try {
      const pickEntries = Object.entries(selectedPicks).map(
        ([pickId, selection]) => ({
          pickId,
          selection,
        })
      );

      await createEntry({
        picks: pickEntries,
        wagerAmount,
        betType: "power",
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to place bet");
    }
  };

  const handleBetSuccess = async () => {
    setSelectedPicks({});
    setIsReadyToFinalize(false);
    await refreshAccount();
  };

  const fetchPicks = async () => {
    setPicksLoading(true);
    setPicksError(null);
    try {
      const availablePicks = await getAvailablePicks();
      setPicks(availablePicks);
    } catch (err) {
      setPicksError("Failed to load picks");
    } finally {
      setPicksLoading(false);
    }
  };

  const handlePickSelect = (pickId: string, selection: "over" | "under") => {
    setSelectedPicks((prev) => ({
      ...prev,
      [pickId]: selection,
    }));
  };

  const handleCardClick = (pickId: string) => {
    setSelectedPicks((prev) => {
      if (prev[pickId]) {
        const newSelectedPicks = { ...prev };
        delete newSelectedPicks[pickId];
        return newSelectedPicks;
      }
      return {
        ...prev,
        [pickId]: "over",
      };
    });
  };

  useEffect(() => {
    fetchPicks();
  }, []);

  const formatBalance = (balance: number): string => {
    return `$${balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="dashboard-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading account data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-screen">
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (isReadyToFinalize) {
    return (
      <div className="dashboard-screen">
        <DashboardHeader
          onMenuClick={handleBackToDashboard}
          accountBalance={
            userAccount ? formatBalance(userAccount.creditBalance) : "$0.00"
          }
          showBackButton={true}
          onDepositClick={handleDepositClick}
        />

        <FinalizeEntry
          selectedPicks={selectedPicks}
          picks={picks}
          userBalance={userAccount?.creditBalance || 0}
          onBack={handleBackToDashboard}
          onClear={handleClearPicks}
          onMakeBet={handleMakeBet}
          onPickDeselect={handlePickDeselect}
          onBetSuccess={handleBetSuccess}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-screen">
      <DashboardHeader
        onMenuClick={handleMenuToggle}
        accountBalance={
          userAccount ? formatBalance(userAccount.creditBalance) : "$0.00"
        }
        onDepositClick={handleDepositClick}
      />

      <div className={`dashboard-content ${isMenuOpen ? "blurred" : ""}`}>
        {userAccount && !userAccount.linkedToBet360 && (
          <Bet360Banner onDownloadBet360={handleDownloadBet360} />
        )}

        {picksLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading picks...</p>
            </div>
        )}

        {picksError && (
          <div className="error-container">
            <p>{picksError}</p>
            <button onClick={fetchPicks}>Retry</button>
          </div>
        )}

        {!picksLoading && !picksError && picks.length > 0 && (
          <PickGrid
            picks={picks}
            selectedPicks={selectedPicks}
            onPickSelect={handlePickSelect}
            onCardClick={handleCardClick}
          />
        )}

        {!picksLoading && !picksError && picks.length === 0 && (
          <div className="no-picks-container">
            <h2>No picks available</h2>
            <p>Check back later for new betting opportunities!</p>
          </div>
        )}
      </div>

      <FinalizeEntryButton
        selectedPicksCount={Object.keys(selectedPicks).length}
        minPicksRequired={2}
        maxPicksAllowed={5}
        isVisible={true}
        onFinalizeEntry={handleFinalizeEntry}
      />

      {isMenuOpen && userAccount && (
        <HamburgerMenu
          onClose={() => setIsMenuOpen(false)}
          onDownloadBet360={handleDownloadBet360}
          onLogout={handleLogout}
          onDeposit={handleDeposit}
          userAccount={userAccount}
        />
      )}

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
        currentBalance={userAccount ? userAccount.creditBalance : 0}
      />
    </div>
  );
};

export default DashboardScreen;
