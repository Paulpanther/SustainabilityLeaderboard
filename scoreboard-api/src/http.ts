import * as _redis from "redis";
import * as express from "express";
import * as morgan from "morgan";
import * as _ from "lodash";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { getTopScorers, getScore, addHighScore } from "./model";

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.text());
app.use(cors());

app.get("/scores", (req, res) => {
  getTopScorers()
    .then(s => res.status(200).end(JSON.stringify(s)));
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

export function init(port: number) {
  app.listen(port);
  console.log(`HTTP: Listening on :${port}`);
}
