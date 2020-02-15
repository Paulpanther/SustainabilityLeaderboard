import * as router from "./router";
import * as session from "./session";
import * as history from "./history";
import 'regenerator-runtime/runtime';

router.init([
    "login",
    "leaderboard",
    "profile"
]);

session.init("login-email", "login-password", "login-submit");

history.showRidesAndVehicles("rides", "vehicles");
