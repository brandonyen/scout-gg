# Scout.gg

Scout.gg is a mini version of the League of Legends profile scouting site, op.gg. Leveraging the Riot Games API to retrieve player and match data, you can view basic player information and a brief match history.

This repository is a companion for the YouTube tutorial, which can be viewed [here](https://youtu.be/-XuVjh-I_xw).

## How to run

To run this project, follow these steps:

1. Clone the repository to your local machine

2. Add your Riot Games API key to an environment file (.env), along with the backend server URL. By default, the server is hosted on localhost:3000:

```
RIOT_API_KEY = RGAPI-xxxxx
VITE_API_BASE_URL = http://localhost:3000
```

3. Install dependencies:

```
npm i
```

4. Start the backend server:

```
node src/api/server.ts
```

5. Start the frontend:

```
npm run dev
```
