import { ServerOption } from "../interface/Routing";

const servers: ServerOption[] = [
  {
    id: 1,
    label: "NA",
    value: {
      region: "americas",
      platform: "na1",
    },
  },
  {
    id: 2,
    label: "EUW",
    value: {
      region: "europe",
      platform: "euw",
    },
  },
  {
    id: 3,
    label: "KR",
    value: {
      region: "asia",
      platform: "kr",
    },
  },
];

export default servers;
