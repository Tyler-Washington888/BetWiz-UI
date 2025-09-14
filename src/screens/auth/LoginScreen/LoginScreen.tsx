import React from "react";
import AuthLayout from "../../../components/layouts/AuthLayout";
import LoginForm from "../../../components/auth/LoginForm";

const LoginScreen: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginScreen;
