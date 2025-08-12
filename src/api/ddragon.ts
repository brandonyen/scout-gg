export const getLatestDDVersion = async () => {
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );

    const versions: string[] = await response.json();

    const latestVersion = versions[0];

    return latestVersion;
  } catch (error) {
    console.error("Error fetching latest data dragon version: ", error);
  }
};
