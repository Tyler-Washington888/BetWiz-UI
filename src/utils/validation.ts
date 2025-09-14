// Validation utilities for authentication forms
// Based on backend user model validation rules

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidation {
  [key: string]: ValidationResult;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 4) {
    return { isValid: false, error: "Password must be at least 4 characters" };
  }

  if (password.length > 40) {
    return { isValid: false, error: "Password cannot exceed 40 characters" };
  }

  if (/\s/.test(password)) {
    return { isValid: false, error: "Password cannot contain spaces" };
  }

  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
};

// First name validation
export const validateFirstName = (firstname: string): ValidationResult => {
  if (!firstname.trim()) {
    return { isValid: false, error: "First name is required" };
  }

  if (firstname.trim().length < 1) {
    return { isValid: false, error: "First name must be at least 1 character" };
  }

  if (firstname.trim().length > 255) {
    return { isValid: false, error: "First name cannot exceed 255 characters" };
  }

  return { isValid: true };
};

// Last name validation
export const validateLastName = (lastname: string): ValidationResult => {
  if (!lastname.trim()) {
    return { isValid: false, error: "Last name is required" };
  }

  if (lastname.trim().length < 1) {
    return { isValid: false, error: "Last name must be at least 1 character" };
  }

  if (lastname.trim().length > 255) {
    return { isValid: false, error: "Last name cannot exceed 255 characters" };
  }

  return { isValid: true };
};

// Date of birth validation
export const validateDateOfBirth = (dateOfBirth: string): ValidationResult => {
  if (!dateOfBirth) {
    return { isValid: false, error: "Date of birth is required" };
  }

  // Validate MM-DD-YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-(19|20)\d{2}$/;
  if (!dateRegex.test(dateOfBirth)) {
    return {
      isValid: false,
      error: "Date of birth must be in MM-DD-YYYY format (e.g., 01-15-1990)",
    };
  }

  // Validate month and day ranges
  const [month, day, year] = dateOfBirth.split("-").map(Number);

  // Check month range
  if (month < 1 || month > 12) {
    return { isValid: false, error: "Please provide a valid month (01-12)" };
  }

  // Days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap year and adjust February
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  if (isLeapYear && month === 2) {
    daysInMonth[1] = 29;
  }

  // Check day range for the specific month
  if (day < 1 || day > daysInMonth[month - 1]) {
    return {
      isValid: false,
      error: "Please provide a valid day for the given month",
    };
  }

  // Check age requirement (21+)
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  let actualAge = age;
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    actualAge = age - 1;
  }

  if (actualAge < 21) {
    return {
      isValid: false,
      error: "You must be at least 21 years old to register",
    };
  }

  return { isValid: true };
};

// Validate all fields for a step
export const validateStep = (
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
