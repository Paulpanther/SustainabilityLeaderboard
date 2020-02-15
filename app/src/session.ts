import * as router from "./router";

let inputToken: HTMLInputElement;
let inputSubmit: HTMLInputElement;
let token: string | false = false;

function onSubmit() {
    token = inputToken.value;
    if (token) {
        document.cookie = `token=${token}`;
        router.showSection(router.getAfterLoginSection());
    }
}

export function init(tokenId: string, submitId: string) {
    inputToken = document.getElementById(tokenId) as HTMLInputElement;
    inputSubmit = document.getElementById(submitId) as HTMLInputElement;
    inputSubmit.addEventListener("submit", onSubmit);
}