import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PersonalInfoCard from "./cards/PersonalInfoCard";
import ContactInfoCard from "./cards/ContactInfoCard";
import BirthdateCard from "./cards/BirthdateCard";
import PasswordCard from "./cards/PasswordCard";
import NotAvailableMessage from "../../common/NotAvailableMessage";
import StepIndicator from "../../common/StepIndicator";
import SignupHeader from "../../common/SignupHeader";
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

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const progressSteps = steps.map((step) => ({
    id: step.id,
    title: step.title,
  }));

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
    setLoading(true);

    try {
      await register(
        signupData.firstname,
        signupData.lastname,
        signupData.email,
        signupData.password,
        signupData.dateOfBirth
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="signup-flow">
      <div className="signup-flow-container">
        {/* Header with Back Button and Logo */}
        <SignupHeader onBack={prevStep} canGoBack={currentStep > 0} />

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

        {/* Current Step Component */}
        <div className="step-content">
          <CurrentStepComponent
            data={signupData}
            updateData={updateSignupData}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            loading={loading}
            error={error}
          />
        </div>
      </div>
      <div className="desktop-not-available">
        <NotAvailableMessage />
      </div>
    </div>
  );
};

export default SignupFlow;
