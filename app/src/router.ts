let sections: HTMLElement[] = [];
let events = new Map<string, () => void>();

function showRequestedSection() {
    let requestedSection = getDefaultSection();
    if (window.location.hash) {
        const requestedSectionId = window.location.hash.substr(1);
        const hashSection = document.getElementById(requestedSectionId);
        if (hashSection) {
            requestedSection = hashSection;
        }
    }

    showSection(requestedSection.id);
}

function getDefaultSection(): HTMLElement {
    return sections.find((section) => section.dataset["default"] !== undefined);
}

export function getAfterLoginSection(): HTMLElement {
    return sections.find((section) => section.dataset["afterLogin"] !== undefined);
}

export function showSection(section: string | HTMLElement) {
    let requestedSection: HTMLElement;
    if (typeof section === "string")
        requestedSection = document.getElementById(section);
    else
        requestedSection = section;

    if (requestedSection) {
        const otherSections = sections.filter((section) => section !== requestedSection);
        for (const section of otherSections)
            section.dataset["shown"] = "false";

        requestedSection.dataset["shown"] = "true";

        if (events.has(requestedSection.id)) {
            events.get(requestedSection.id)();
        }
    }
}

export function onSectionShow(section: string, callback: () => void) {
    events.set(section, callback);
}

export function init(sectionIds: string[]) {
    sections = sectionIds.map((id) => document.getElementById(id));

    window.addEventListener('hashchange', showRequestedSection);
    showRequestedSection();
}