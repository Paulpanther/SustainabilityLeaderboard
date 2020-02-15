import * as router from "./router";
import * as session from "./session";

router.init([
    "login",
    "leaderboard",
    "profile"
]);

session.init("login-token", "login-submit");