import * as axios from "axios";

const httpBaseUrl = "http://sustainability-scoreboard-api.simonknott.de:3000";

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
type Leaderboard = Record<string, number>;

export function subscribeToLeaderBoard(
  onChange: (leaderBoard: Leaderboard) => void
): Unsubscribe {
  const ws = new WebSocket(wsBaseUrl);

  ws.onmessage = ({ data }) => {
    const parsed = JSON.parse(data);
    onChange(parsed);
  };

  return () => ws.close();
}