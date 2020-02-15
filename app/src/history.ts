import {getPrototype} from "./dom_util";
import {EnrichedRide, Vehicle} from "./datatypes";

class VehicleElement {
    public constructor(private vehicleData: Vehicle) {}

    public addToHtml(parent: HTMLElement) {
        const vehicle = getPrototype(parent);
        const labelElem = vehicle.querySelector(".label");
        const co2Elem = vehicle.querySelector(".co2");
        const kmElem = vehicle.querySelector(".km");

        // @ts-ignore
        labelElem.innerText = this.vehicleData.name;
        // @ts-ignore
        co2Elem.innerText = this.vehicleData.totalCo2;
        // @ts-ignore
        kmElem.innerText = this.vehicleData.totalKm;

        parent.appendChild(vehicle);
    }
}

class RideElement {
    public constructor(private rideData: EnrichedRide) {}

    public addToHtml(parent: HTMLElement) {
        const ride = getPrototype(parent);
        const labelElem = ride.querySelector(".label");
        const priceElem = ride.querySelector(".price");
        const co2Elem = ride.querySelector(".co2");
        const kmElem = ride.querySelector(".km");
        const startTimeElem = ride.querySelector(".start-time");
        const endTimeElem = ride.querySelector(".end-time");

        // @ts-ignore
        labelElem.innerText = this.rideData.vehicle;
        // @ts-ignore
        priceElem.innerText = this.rideData.price;
        // @ts-ignore
        co2Elem.innerText = this.rideData.co2;
        // @ts-ignore
        kmElem.innerText = this.rideData.km;
        const formatOptions = {weekday: "long", month: "long", day: "numeric"};
        const startTime = this.rideData.start.timestamp;
        // @ts-ignore
        startTimeElem.innerText = startTime.toLocaleDateString("en-US", formatOptions);
        const endTime = this.rideData.end.timestamp;
        // @ts-ignore
        endTimeElem.innerText = endTime.toLocaleDateString("en-US", formatOptions);

        parent.appendChild(ride);
    }
}

function showVehicles(vehiclesContainerId: string, vehicles: Vehicle[]) {
    const vehiclesContainer = document.getElementById(vehiclesContainerId);
    vehicles.forEach((vehicle) => new VehicleElement(vehicle).addToHtml(vehiclesContainer));
}

function showRides(ridesContainerId: string, rides: EnrichedRide[]) {
    const ridesContainer = document.getElementById(ridesContainerId);
    rides.forEach((ride) => new RideElement(ride).addToHtml(ridesContainer));
}

function convertRidesToVehicles(rides: EnrichedRide[]): Vehicle[] {
    const vehicles = new Map<string, Vehicle>();
    for (const ride of rides) {
        if (vehicles.has(ride.vehicle)) {
            const vehicle = vehicles.get(ride.vehicle);
            vehicle.totalKm += ride.km;
            vehicle.totalCo2 += ride.co2;
        }
    }
    return Array.from(vehicles.values());
}

export function showRidesAndVehicles(ridesContainerId: string, vehiclesContainerId: string) {
    const rides: EnrichedRide[] = [
        {
            start: {
                timestamp: new Date(),
                location: {
                    lat: 0,
                    lon: 0,
                }
            },
            end: {
                timestamp: new Date(),
                location: {
                    lat: 0,
                    lon: 0,
                }
            },
            price: 10,
            co2: 20,
            km: 30,
            vehicle: "car",
            co2PerKm: 20 / 30,
            makeAndModel: "vw"
        }
    ];
    const vehicles = convertRidesToVehicles(rides);
    showRides(ridesContainerId, rides);
    showVehicles(vehiclesContainerId, vehicles);
}