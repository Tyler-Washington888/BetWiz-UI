import React from "react";
import betwizLogo from "../../../assets/betwiz-logo.svg";
import betwizHorizontalLogo from "../../../assets/betwiz-horizontal-logo.svg";
import "./Logo.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
  variant?: "vertical" | "horizontal";
}

const Logo: React.FC<LogoProps> = ({
  size = "medium",
  variant = "vertical",
}) => {
  const sizeClasses = {
    small: "logo-small",
    medium: "logo-medium",
    large: "logo-large",
  };

  const logoSrc = variant === "horizontal" ? betwizHorizontalLogo : betwizLogo;
  const logoClass =
    variant === "horizontal" ? "betwiz-horizontal-logo" : "betwiz-logo";

  return (
    <div className="logo-container">
      <img
        src={logoSrc}
        alt="Betwiz Logo"
        className={`${logoClass} ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Logo;
