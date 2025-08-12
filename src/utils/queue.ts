const getQueueMode = (queueId: number) => {
  switch (queueId) {
    case 400:
      return "Normal Draft";

    case 420:
      return "Ranked Solo/Duo";

    case 440:
      return "Ranked Flex";

    case 450:
      return "ARAM";

    case 480:
      return "Swiftplay";

    default:
      return "Custom/RGM";
  }
};

export default getQueueMode;
