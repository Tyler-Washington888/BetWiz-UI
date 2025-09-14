import AuthLayout from "../../../components/layouts/AuthLayout";
import SignupFlow from "../../../components/auth/SignupFlow";

const SignupScreen: React.FC = () => {
  return (
    <AuthLayout>
      <SignupFlow />
    </AuthLayout>
  );
};

export default SignupScreen;
