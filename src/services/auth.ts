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
  isSubscribed?: boolean;
  subscribedBet360Emails?: string[];
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
  isSubscribed?: boolean;
  subscribedBet360Emails?: string[];
  role: string;
  token: string;
  creditBalance: number;
}

const formatDateOfBirthForApi = (dateOfBirthRaw: string): string => {
  const dob = (dateOfBirthRaw || "").trim();

  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const [yyyy, mm, dd] = dob.split("-");
    return `${mm}-${dd}-${yyyy}`;
  }

  
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
    const [mm, dd, yyyy] = dob.split("/");
    return `${mm}-${dd}-${yyyy}`;
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dob)) {
    const [yyyy, mm, dd] = dob.split("/");
    return `${mm}-${dd}-${yyyy}`;
  }

  
  return dob;
};

export const loginUser = async (loginData: LoginData): Promise<User> => {
  const resp = await api.post<AuthResponse>("/api/users/login", loginData);
  localStorage.setItem("authToken", resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`;

  
  const { token, ...userData } = resp.data;
  return userData;
};

export const registerUser = async (
  registerData: RegisterData
): Promise<User> => {
  const payload: RegisterData = {
    ...registerData,
    dateOfBirth: formatDateOfBirthForApi(registerData.dateOfBirth),
  };

  const resp = await api.post<AuthResponse>(
    "/api/users/signup",
    payload
  );
  localStorage.setItem("authToken", resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`;

  
  const { token, ...userData } = resp.data;
  return userData;
};

export const verifyUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    const resp = await api.get<User>("/api/users/profile");
    return resp.data;
  }
  return null;
};

export const removeToken = (): void => {
  api.defaults.headers.common.authorization = "";
};
