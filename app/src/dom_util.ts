export function getPrototype(parent: HTMLElement): HTMLElement {
    const proto = Array.from(parent.children)
        .find((child) => child.classList.contains("prototype"))
        .cloneNode(true) as HTMLElement;
    proto.classList.remove("prototype");
    return proto;
}

export function getCookie(name: string): string {
    for (const cookie of document.cookie.split("; ")) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return "";
}

export function removeCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}