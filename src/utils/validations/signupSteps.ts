// Signup flow step validation utilities
import { FieldValidation } from "./types";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
  validateDateOfBirth,
} from "./authValidation";

// Validate all fields for a signup step
export const validateSignupStep = (
  step: string,
  data: Record<string, any>
): FieldValidation => {
  const errors: FieldValidation = {};

  switch (step) {
    case "personal":
      errors.firstname = validateFirstName(data.firstname);
      errors.lastname = validateLastName(data.lastname);
      break;

    case "contact":
      errors.email = validateEmail(data.email);
      break;

    case "birthdate":
      errors.dateOfBirth = validateDateOfBirth(data.dateOfBirth);
      break;

    case "password":
      errors.password = validatePassword(data.password);
      errors.confirmPassword = validateConfirmPassword(
        data.password,
        data.confirmPassword
      );
      break;

    default:
      break;
  }

  return errors;
};

// Check if a step is valid
export const isStepValid = (errors: FieldValidation): boolean => {
  return Object.values(errors).every((result) => result.isValid);
};

// Get first error message for a step
export const getFirstError = (errors: FieldValidation): string | null => {
  for (const result of Object.values(errors)) {
    if (!result.isValid && result.error) {
      return result.error;
    }
  }
  return null;
};

