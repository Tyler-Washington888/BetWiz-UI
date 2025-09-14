import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role?: string;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  linkedBet360Account: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  linkedBet360Account: boolean;
  role: string;
  token: string;
}

export const loginUser = async (loginData: LoginData): Promise<User> => {
  const resp = await api.post<AuthResponse>("/api/users/login", loginData);
  localStorage.setItem("authToken", resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`;

  // Extract user data without token
  const { token, ...userData } = resp.data;
  return userData;
};

export const registerUser = async (
  registerData: RegisterData
): Promise<User> => {
  const resp = await api.post<AuthResponse>(
    "/api/users/register",
    registerData
  );
  localStorage.setItem("authToken", resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`;

  // Extract user data without token
  const { token, ...userData } = resp.data;
  return userData;
};

export const verifyUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    const resp = await api.get<User>("/api/users/my-data");
    return resp.data;
  }
  return null;
};

export const removeToken = (): void => {
  api.defaults.headers.common.authorization = "";
};
