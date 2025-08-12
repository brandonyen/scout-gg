import { RiotRankedData } from "../interface/Riot/RiotRankedData";

export interface SummonerProfileProps {
  profileIconId: number;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
  rankedData: RiotRankedData | null;
}

const SummonerProfile = ({
  ddVersion,
  profileIconId,
  gameName,
  tagLine,
  summonerLevel,
  rankedData,
}: SummonerProfileProps & { ddVersion: string }) => {
  return (
    <div className="flex items-center">
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/profileicon/${profileIconId}.png`}
        className="size-24 mr-4 rounded-lg"
        alt="Summoner icon"
      />
      <div>
        <strong>
          {gameName}#{tagLine}
        </strong>
        <p>
          <strong>Summoner Level: </strong>
          {summonerLevel}
        </p>
        {rankedData ? (
          <p>
            <strong>{rankedData.queueType}: </strong>
            {rankedData.tier} {rankedData.rank}{" "}
            {rankedData.leaguePoints.toString()}LP ({rankedData.wins}W{" "}
            {rankedData.losses}L)
          </p>
        ) : (
          <p>There is no ranked information available.</p>
        )}
      </div>
    </div>
  );
};

export default SummonerProfile;
