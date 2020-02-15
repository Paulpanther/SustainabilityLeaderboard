import * as router from "./router";
import * as api from "./api";

let inputEmail: HTMLInputElement;
let inputPassword: HTMLInputElement;
let inputSubmit: HTMLInputElement;
let token: string | false = false;

function onSubmit(e: Event) {
    if (e.preventDefault) e.preventDefault();

    api.signIn(inputEmail.value, inputPassword.value).then((tokenPair) => {
        if (tokenPair) {
            document.cookie = `accessToken=${tokenPair.accessToken}`;
            document.cookie = `refreshToken=${tokenPair.refreshToken}`;
            router.showSection(router.getAfterLoginSection());
        }
    });
    
    return false;
}

export function init(emailId: string, passwordId: string, submitId: string) {
    inputEmail = document.getElementById(emailId) as HTMLInputElement;
    inputPassword = document.getElementById(passwordId) as HTMLInputElement;
    inputSubmit = document.getElementById(submitId) as HTMLInputElement;
    inputSubmit.addEventListener("submit", onSubmit);
}