import { UserAccount } from "../contexts/UserContext";

const API_BASE_URL = "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Make authenticated API request
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Get user account data
// Backend route: GET /api/users/profile
export const getUserAccount = async (): Promise<UserAccount> => {
  try {
    const data = await makeAuthenticatedRequest("/users/profile");

    return {
      userId: data._id,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      creditBalance: data.creditBalance,
      linkedToBet360: data.linkedBet360Account,
    };
  } catch (error) {
    console.error("Error fetching user account:", error);
    throw error;
  }
};

// Acknowledge Betwiz-Bet360 link
// Backend route: PUT /api/users/acknowledge-betwiz-bet360-link/:email
export const acknowledgeBetwizBet360Link = async (email: string) => {
  try {
    return await makeAuthenticatedRequest(
      `/users/acknowledge-betwiz-bet360-link/${email}`,
      {
        method: "PUT",
      }
    );
  } catch (error) {
    console.error("Error acknowledging Betwiz-Bet360 link:", error);
    throw error;
  }
};
