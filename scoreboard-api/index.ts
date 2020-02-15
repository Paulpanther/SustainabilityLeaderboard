import * as _redis from "redis";
import * as express from "express";
import * as morgan from "morgan";
import * as _ from "lodash";
import * as ws from "ws";
import * as bodyParser from "body-parser";

const { REDIS_HOST, REDIS_PORT, HTTP_PORT = "3000", WS_PORT = "3001", MAX_LENGTH = 10 } = process.env;

const redis = _redis.createClient({
  host: REDIS_HOST,
  port: +REDIS_PORT
});

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.text());

const listeners: Set<ws> = new Set();

const getScoreForUser = (user: string) => new Promise<number>(resolve => {
  redis.zscore("scores", user, (err, score) => {
    if (err) {
      console.error(err);
    }

    resolve(+score);
  })
})

function getCurrentHighScoresAsJSON(cb: (s: string) => void) {
  redis.zrange("scores", 0, +MAX_LENGTH, (err, reply) => {
    if (err) {
      console.error(err);
    }

    async function enrich() {
      const pairs = await Promise.all(reply.map(async user => {
        const score = await getScoreForUser(user);
        return [user, score];
      }));

      return _.fromPairs(pairs);
    }

    enrich().then(s => cb(JSON.stringify(s)));
  });
}

function getScore(username: string, cb: (n: number) => void) {
  redis.zscore("scores", username, (err, score) => {
    if (err) {
      console.error(err);
    }

    cb(+score);
  })
}

function addHighScore(username: string, score: number, cb: () => void) {
  redis.zadd("scores", score, username, err => {
    if (err) {
      console.error(err);
    }

    updateScoreBoard(cb);
  });
}

let lastHighScores = "";

function updateScoreBoard(cb: () => void) {
  getCurrentHighScoresAsJSON(json => {
    if (lastHighScores == json) {
      return cb();
    }

    lastHighScores = json;
    listeners.forEach(ws => ws.send(lastHighScores));

    cb();
  })
}

app.get("/scores", (req, res) => {
  getCurrentHighScoresAsJSON(s => {
    res.send(200).end(s);
  })
});

app.get("/scores/:username", (req, res) => {
  const { username } = req.params;
  getScore(
    username,
    score => res.status(200).end(score)
  );
});

app.post("/scores/:username", (req, res) => {
  const { username } = req.params;
  const score = req.body;

  addHighScore(username, +score, () => {
    res.status(200).end();
  });
});

app.listen(+HTTP_PORT);
console.log(`HTTP: Listening on ${HTTP_PORT}`);
console.log(`WS: Listening on ${WS_PORT}`);

const wss = new ws.Server({
  port: +WS_PORT,
});

wss.on("connection", ws => {
  listeners.add(ws);
  getCurrentHighScoresAsJSON(s => ws.send(s));

  ws.on(
    "close",
    () => listeners.delete(ws)
  );
});
