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
type Leaderboard = {
  topScorers: Record<string, number>,
  own: {
    score: number,
    rank: number,
  },
  totalUsersCount: number,
}

export function subscribeToLeaderBoard(
  username: string,
  onChange: (leaderBoard: Leaderboard) => void
): Unsubscribe {
  const ws = new WebSocket(wsBaseUrl);

  ws.onmessage = ({ data }) => {
    const parsed = JSON.parse(data);
    onChange(parsed);
  };

  ws.send(username);

  return () => ws.close();
}