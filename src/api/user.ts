import axios, { AxiosResponse } from "axios";
import { RiotUserData } from "../interface/Riot/RiotUserData";
import { RiotSummonerData } from "../interface/Riot/RiotSummonerData";
import { RiotRankedData } from "../interface/Riot/RiotRankedData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserData = async (
  gameName: string,
  tagLine: string,
  region: string
): Promise<AxiosResponse<RiotUserData>> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/userData`, {
    params: {
      gamename: encodeURIComponent(gameName),
      tagline: encodeURIComponent(tagLine),
      region: region,
    },
  });

  return response;
};

export const getSummonerData = async (
  puuid: string,
  platform: string
): Promise<AxiosResponse<RiotSummonerData>> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/summonerData`, {
    params: {
      puuid: puuid,
      platform: platform,
    },
  });

  return response;
};

export const getRankedData = async (
  puuid: string,
  platform: string
): Promise<AxiosResponse<RiotRankedData[]>> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/rankedData`, {
    params: {
      puuid: puuid,
      platform: platform,
    },
  });

  return response;
};
