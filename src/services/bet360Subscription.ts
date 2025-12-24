import axios from "axios";

const API_BASE_URL = "http://localhost:5001";
const BET360_UI_URL = import.meta.env.VITE_BET360_UI_URL || "http://localhost:5173";

export interface SubscriptionResponse {
  message: string;
  isSubscribed: boolean;
  subscribedBet360Emails: string[];
}


export const getBet360SubscribeEmail = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("bet360Email");
  return email ? decodeURIComponent(email) : null;
};


export const clearBet360Data = (): void => {
  
  const url = new URL(window.location.href);
  url.searchParams.delete("bet360Email");
  window.history.replaceState({}, "", url.toString());
};


export const subscribeToBet360 = async (
  userId: string,
  bet360Email: string
): Promise<SubscriptionResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.post<SubscriptionResponse>(
    `${API_BASE_URL}/api/users/${userId}/subscribe`,
    { bet360Email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  
  
  clearBet360Data();
  
  return response.data;
};


export const getBet360ConnectUrl = (): string => {
  return `${BET360_UI_URL}/connect-sportsbooks`;
};

