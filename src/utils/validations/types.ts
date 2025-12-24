

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidation {
  [key: string]: ValidationResult;
}

