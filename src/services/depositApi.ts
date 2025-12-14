import { makeAuthenticatedRequest } from "./userApi";

// Deposit amount interface
export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}

// Make deposit
// Backend route: PUT /api/checking-account/deposit
export const makeDeposit = async (amount: number): Promise<DepositResponse> => {
  try {
    const data = await makeAuthenticatedRequest("/checking-account/deposit", {
      method: "PUT",
      body: JSON.stringify({ amount }),
    });

    return {
      success: true,
      message: data.message || "Deposit successful",
      newBalance: data.balance,
    };
  } catch (error) {
    console.error("Error making deposit:", error);
    throw error;
  }
};
