import {getPrototype} from "./dom_util";

class VehicleOverview {
    public constructor(private label: string, private co2: number, private km: number) {}

    public addToHtml(parent: HTMLElement) {
        const vehicle = getPrototype(parent);
        const labelElem = vehicle.querySelector(".label");
        const co2Elem = vehicle.querySelector(".co2");
        const kmElem = vehicle.querySelector(".km");

        // @ts-ignore
        labelElem.innerText = this.label;
        // @ts-ignore
        co2Elem.innerText = this.co2;
        // @ts-ignore
        kmElem.innerText = this.km;

        parent.appendChild(vehicle);
    }
}

export function showHistory(vehiclesId: string) {
    const vehicles = document.getElementById(vehiclesId);
    new VehicleOverview("Hey", 2, 3).addToHtml(vehicles);
}