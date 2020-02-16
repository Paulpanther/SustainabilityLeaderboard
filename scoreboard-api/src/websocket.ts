import * as ws from "ws";
import { makeCurrentHighScoresUpdater } from "./model";

function onOpen(ws: ws) {
  let unsubscribe = () => {};
  ws.on("message", function message(data) {
    unsubscribe();

    const username = data;
    const update = makeCurrentHighScoresUpdater("" + username);
    
    unsubscribe = update(s => ws.send(s));
  })

  ws.on("close", unsubscribe);
}

export function init(port: number) {
  const wss = new ws.Server({ port });
  wss.on("connection", onOpen);

  console.log(`WS: Listening on :${port}`);
}
