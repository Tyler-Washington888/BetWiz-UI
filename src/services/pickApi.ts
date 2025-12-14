import api from "./api";
import { Pick } from "../components/common/PickCard";

export const getAvailablePicks = async (): Promise<Pick[]> => {
  try {
    const response = await api.get("/api/picks");
    return response.data;
  } catch (error) {
    console.error("Error fetching picks:", error);
    throw error;
  }
};
