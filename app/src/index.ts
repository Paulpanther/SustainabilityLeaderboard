import * as router from "./router";
import * as session from "./session";
import * as history from "./history";

router.init([
    "login",
    "leaderboard",
    "profile"
]);

session.init("login-token", "login-submit");

history.showHistory("vehicles");
