import api from "./api";

export interface EntryPickRequest {
  pickId: string;
  selection: "over" | "under";
}

export interface CreateEntryRequest {
  picks: EntryPickRequest[];
  wagerAmount: number;
  betType: string;
}

export interface CreateEntryResponse {
  success: boolean;
  entry: {
    _id: string;
    userId: string;
    picks: Array<{
      pickId: string;
      selection: "over" | "under";
    }>;
    wagerAmount: number;
    potentialPayout: number;
    betType: string;
    status: string;
    createdAt: string;
  };
  message: string;
}

export const createEntry = async (
  entryData: CreateEntryRequest
): Promise<CreateEntryResponse> => {
  const response = await api.post<CreateEntryResponse>(
    "/api/entries",
    entryData
  );
  return response.data;
};
