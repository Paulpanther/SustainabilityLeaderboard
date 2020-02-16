import * as _redis from "redis";
import { EventEmitter } from "events";
import * as _ from "lodash";

const { REDIS_HOST, REDIS_PORT, MAX_LENGTH = 10 } = process.env;

const redis = _redis.createClient({
  host: REDIS_HOST,
  port: +REDIS_PORT
});

const getScoreOfUser = (user: string) => new Promise<number>(resolve => {
  redis.zscore("scores", user, (err, score) => {
    if (err) {
      console.error(err);
    }

    resolve(+score);
  })
})

const getRankOfUser = (user: string) => new Promise<number>(resolve => {
  redis.zrank("scores", user, (err, score) => {
    if (err) {
      console.error(err);
    }

    resolve(+score);
  })
})

const getTotalUsersCount = () => new Promise<number>(resolve => {
  redis.zcard("scores", (err, score) => {
    if (err) {
      console.error(err);
    }

    resolve(+score);
  })
})

const highScores = new EventEmitter();

type Unsubscribe = () => void;

export const getTopScorers = () => new Promise<{ [username: string]: number }>(resolve => {
  redis.zrange("scores", 0, +MAX_LENGTH, (err, reply) => {
    if (err) {
      console.error(err);
    }

    async function enrich() {
      const pairs = await Promise.all(reply.map(async user => {
        const score = await getScoreOfUser(user);
        return [user, score];
      }));

      return _.fromPairs(pairs);
    }

    enrich().then(resolve);
  });
})

export const makeCurrentHighScoresUpdater = (username: string) => (cb: (s: string) => void): Unsubscribe => {
  let lastJson = "";
  async function update() {
    const json = JSON.stringify({
      topScorers: await getTopScorers(),
      own: {
        score: await getScoreOfUser(username),
        rank: await getRankOfUser(username)
      },
      totalUsersCount: await getTotalUsersCount(),
    });

    if (json !== lastJson) {
      lastJson = json;
      cb(json);
    }
  }

  update();

  highScores.on("change", update);
  return () => {
    highScores.removeListener("change", update);
  }
}

export function getScore(username: string, cb: (n: number) => void) {
  redis.zscore("scores", username, (err, score) => {
    if (err) {
      console.error(err);
    }

    cb(+score);
  })
}

export function addHighScore(username: string, score: number, cb: () => void) {
  redis.zadd("scores", score, username, err => {
    if (err) {
      console.error(err);
    }

    highScores.emit("change");

    cb();
  });
}