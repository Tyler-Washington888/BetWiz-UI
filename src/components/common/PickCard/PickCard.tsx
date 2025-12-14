import React from "react";
import "./PickCard.css";

export interface Pick {
  _id: string;
  player: {
    _id: string;
    firstName: string;
    lastName: string;
    team: string;
    position: string;
    imageUrl?: string;
  };
  game: {
    _id: string;
    homeTeam: string;
    awayTeam: string;
    startTime: string;
  };
  statType: string;
  line: number;
}

interface PickCardProps {
  pick: Pick;
  isSelected: boolean;
  selectedOption: "over" | "under" | null;
  onSelect: (pickId: string, selection: "over" | "under") => void;
  onCardClick?: (pickId: string) => void;
}

const PickCard: React.FC<PickCardProps> = ({
  pick,
  isSelected,
  selectedOption,
  onSelect,
  onCardClick,
}) => {
  const getOpponentTeam = () => {
    const playerTeam = pick.player.team;
    const homeTeam = pick.game.homeTeam;
    const awayTeam = pick.game.awayTeam;

    if (playerTeam === homeTeam) {
      return awayTeam.split(" ").pop();
    }
    return homeTeam.split(" ").pop();
  };

  const getPlayerImageUrl = () => {
    if (pick.player.imageUrl) return pick.player.imageUrl;
    return `https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=${pick.player.firstName.charAt(
      0
    )}${pick.player.lastName.charAt(0)}`;
  };

  const formatStatType = (statType: string) => {
    return statType.charAt(0).toUpperCase() + statType.slice(1);
  };

  return (
    <div
      className={`pick-card ${isSelected ? "selected" : ""}`}
      onClick={() => onCardClick?.(pick._id)}
    >
      <div className="player-image-container">
        <img
          src={getPlayerImageUrl()}
          alt={`${pick.player.firstName} ${pick.player.lastName}`}
          className="player-image"
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = `https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=${pick.player.firstName.charAt(
              0
            )}${pick.player.lastName.charAt(0)}`;
          }}
        />
      </div>

      <div className="player-name">
        {pick.player.firstName} {pick.player.lastName}
      </div>

      <div className="matchup">vs {getOpponentTeam()}</div>

      <div className="stat-line">
        {pick.line} {formatStatType(pick.statType)}
      </div>

      <div className="action-buttons">
        <button
          className={`action-btn less-btn ${
            selectedOption === "under" ? "selected" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pick._id, "under");
          }}
        >
          Less
        </button>
        <button
          className={`action-btn more-btn ${
            selectedOption === "over" ? "selected" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pick._id, "over");
          }}
        >
          More
        </button>
      </div>
    </div>
  );
};

export default PickCard;

