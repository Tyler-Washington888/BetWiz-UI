import { makeAuthenticatedRequest } from "./userApi";


export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  success: boolean;
  message: string;
  newBalance?: number;
}



export const makeDeposit = async (amount: number): Promise<DepositResponse> => {
  try {
    const data = await makeAuthenticatedRequest("/api/checking-account/deposit", {
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
