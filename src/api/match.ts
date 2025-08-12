import axios, { AxiosResponse } from "axios";
import { RiotMatchData } from "../interface/Riot/RiotMatchData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMatchList = async (
  puuid: string,
  count: string,
  region: string
): Promise<AxiosResponse<string[]>> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/matchList`, {
    params: {
      puuid: puuid,
      count: count,
      region: region,
    },
  });

  return response;
};

export const getMatchData = async (
  matchId: string,
  region: string
): Promise<RiotMatchData> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/matchData`, {
    params: {
      matchid: matchId,
      region: region,
    },
  });

  return response.data["info"];
};
