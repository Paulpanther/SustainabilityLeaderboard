import * as _redis from "redis";
import * as _ from "lodash";
import * as http from "./http";
import * as websocket from "./websocket";

const { HTTP_PORT = "3000", WS_PORT = "3001" } = process.env;

http.init(+HTTP_PORT);
websocket.init(+WS_PORT);
