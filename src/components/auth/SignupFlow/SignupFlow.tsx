import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PersonalInfoCard from "./cards/PersonalInfoCard";
import ContactInfoCard from "./cards/ContactInfoCard";
import BirthdateCard from "./cards/BirthdateCard";
import PasswordCard from "./cards/PasswordCard";
import StepIndicator from "../../common/StepIndicator";
import SignupHeader from "../../common/SignupHeader";
import { subscribeToBet360, getBet360ConnectUrl, getBet360SubscribeEmail, clearBet360Data } from "../../../services/bet360Subscription";
import "./SignupFlow.css";

export interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

const SignupFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signupData, setSignupData] = useState<SignupData>({
    firstname: "",
    lastname: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const isBet360Flow = location.pathname.includes("/bet360");
  const bet360Email = getBet360SubscribeEmail();

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      component: PersonalInfoCard,
    },
    { id: "contact", title: "Contact Information", component: ContactInfoCard },
    { id: "birthdate", title: "Date of Birth", component: BirthdateCard },
    { id: "password", title: "Create Password", component: PasswordCard },
  ];

  const updateSignupData = (field: keyof SignupData, value: string) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSubscriptionError("");
    setSubscriptionSuccess(false);
    setLoading(true);

    try {
      const userData = await register(
        signupData.firstname,
        signupData.lastname,
        signupData.email,
        signupData.password,
        signupData.dateOfBirth
      );

      
      if (isBet360Flow && userData && bet360Email) {
        setLoading(false);
        setSubscribing(true);
        try {
          await subscribeToBet360(userData._id, bet360Email);
          
          setSubscriptionSuccess(true);
          setSubscribing(false);
          
          
          clearBet360Data();
          setTimeout(() => {
            window.location.href = getBet360ConnectUrl();
          }, 3000);
          return;
        } catch (subErr: any) {
          
          setSubscribing(false);
          const subErrorMsg =
            subErr?.response?.data?.message ||
            subErr?.response?.data?.error ||
            subErr?.message ||
            "Failed to connect to Bet360";
          setSubscriptionError(subErrorMsg);
          
          
          clearBet360Data();
          
          setTimeout(() => {
            window.location.href = getBet360ConnectUrl();
          }, 3000);
          return;
        }
      } else if (isBet360Flow && !bet360Email) {
        
        setLoading(false);
        clearBet360Data();
        setSubscriptionError("Bet360 connection data not found. Redirecting...");
        setTimeout(() => {
          window.location.href = getBet360ConnectUrl();
        }, 2000);
        return;
      }

      
      navigate("/dashboard");
    } catch (err) {
      const apiError =
        (err as any)?.response?.data?.error ||
        (err as any)?.response?.data?.message ||
        "Failed to create account. Please try again.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="signup-flow">
      <div className="signup-flow-container">
        {}
        <SignupHeader onBack={prevStep} canGoBack={currentStep > 0} showSignIn={currentStep === 0} />

        {}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

        {}
        <div className="step-content">
          {subscribing && (
            <div className="subscription-loading-message">
              <div className="loading-spinner-small"></div>
              <span>Connecting to Bet360...</span>
            </div>
          )}
          {subscriptionSuccess && (
            <div className="subscription-success-message">
              <span className="success-icon">✓</span>
              <span>Successfully connected to Bet360!</span>
              <br />
              <small>Redirecting back to Bet360...</small>
            </div>
          )}
          {subscriptionError && (
            <div className="subscription-error-message">
              {subscriptionError}
              <br />
              <small>Redirecting to Bet360...</small>
            </div>
          )}
          <CurrentStepComponent
            data={signupData}
            updateData={updateSignupData}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            loading={loading || subscribing}
            error={error}
            {...(currentStep === steps.length - 1 && isBet360Flow ? { isBet360Flow: true } : {})}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
