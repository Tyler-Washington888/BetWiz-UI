import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import SignupForm from "../../components/auth/SignupForm";

const SignupScreen: React.FC = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupScreen;
