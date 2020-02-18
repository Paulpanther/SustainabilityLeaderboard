import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import * as router from "./router";
import * as session from "./session";
import * as history from "./history";
import 'regenerator-runtime/runtime';

router.init([
    "login",
    "scoreboard",
    "profile",
    "logout",
]);

router.onSectionShow("profile", () => {
    history.showRidesAndVehicles("rides", "vehicles");
});

router.onSectionShow("logout", () => {
    session.logout();
});

router.onSectionShow("scoreboard", () => {
    history.showAndFetchScoreboard("top10AndOwn");
})

session.init("login-email", "login-password", "login-submit");

