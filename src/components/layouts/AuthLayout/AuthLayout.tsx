import React, { ReactNode } from "react";
import NotAvailableMessage from "../../common/NotAvailableMessage";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">{children}</div>
      <div className="desktop-not-available">
        <NotAvailableMessage />
      </div>
    </div>
  );
};

export default AuthLayout;
