import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import * as router from "./router";
import * as session from "./session";
import * as history from "./history";
import 'regenerator-runtime/runtime';

router.init([
    "login",
    "leaderboard",
    "profile"
]);

router.onSectionShow("profile", () => {
    history.showRidesAndVehicles("rides", "vehicles");
});

session.init("login-email", "login-password", "login-submit");

