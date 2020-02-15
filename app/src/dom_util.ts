export function getPrototype(parent: HTMLElement): HTMLElement {
    const proto = Array.from(parent.children)
        .find((child) => child.classList.contains("prototype"))
        .cloneNode(true) as HTMLElement;
    proto.classList.remove("prototype");
    return proto;
}
