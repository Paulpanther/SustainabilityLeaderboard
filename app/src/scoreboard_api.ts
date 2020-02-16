import * as axios from "axios";

const httpBaseUrl = "https://sustainability-scoreboard-api.simonknott.de/api";

export async function publishScore(username: string, score: number) {
  await axios.post(
    `${httpBaseUrl}/scores/${username}`,
    "" + score,
    {
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
}

const wsBaseUrl = "ws://sustainability-scoreboard-api.simonknott.de:3001";

type Unsubscribe = () => void;

// Maps from username to score
export type Scoreboard = {
  topScorers: Record<string, number>,
  own: {
    score: number,
    rank: number,
  },
  totalUsersCount: number,
}

export function subscribeToScoreBoard(
  username: string,
  onChange: (leaderBoard: Scoreboard) => void
): Unsubscribe {
  const ws = new WebSocket(wsBaseUrl);

  ws.onmessage = ({ data }) => {
    const parsed = JSON.parse(data);
    onChange(parsed);
  };
  
  ws.onopen = () => {
    ws.send(username);
  }

  return () => ws.close();
}