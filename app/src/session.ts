import * as router from "./router";
import * as api from "./api";
import {getCookie} from "./dom_util";

let inputEmail: HTMLInputElement;
let inputPassword: HTMLInputElement;
let inputSubmit: HTMLInputElement;

function onSubmit(e: Event) {
    if (e.preventDefault) e.preventDefault();

    api.signIn(inputEmail.value, inputPassword.value).then((tokenPair) => {
        if (tokenPair) {
            document.cookie = `accessToken=${tokenPair.accessToken};expires=${tokenPair.accessTokenExpiresAt}`;
            document.cookie = `refreshToken=${tokenPair.refreshToken};expires=${tokenPair.refreshTokenExpiresAt}`;
            router.showSection(router.getAfterLoginSection());
        }
    });
    
    return false;
}

function isAlreadyLogin() {
    const token = getCookie("accessToken");
    if (token) {
        router.showSection(router.getAfterLoginSection());
    }
}

export function init(emailId: string, passwordId: string, submitId: string) {
    inputEmail = document.getElementById(emailId) as HTMLInputElement;
    inputPassword = document.getElementById(passwordId) as HTMLInputElement;
    inputSubmit = document.getElementById(submitId) as HTMLInputElement;
    inputSubmit.addEventListener("submit", onSubmit);
    isAlreadyLogin();
}