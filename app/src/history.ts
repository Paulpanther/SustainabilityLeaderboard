import { getCookie, getPrototype, removeOldEntries } from "./dom_util";
import { EnrichedRide, Vehicle } from "./datatypes";
import * as api from "./api";
import * as cdc from "./carbon_dioxide_calculator";
import * as scoreboardApi from "./scoreboard_api";
import { Scoreboard } from "./scoreboard_api";
import * as _ from "lodash";

class VehicleElement {
    public constructor(private vehicleData: Vehicle) {}

    public addToHtml(parent: HTMLElement) {
        const vehicle = getPrototype(parent);
        const labelElem = vehicle.querySelector(".label");
        const co2Elem = vehicle.querySelector(".co2");
        const kmElem = vehicle.querySelector(".km");

        switch (this.vehicleData.name) {
            case "driveby":
                // @ts-ignore
                labelElem.innerText = "Miles carsharing";
                break;
            case 'nextbike':
                // @ts-ignore
                labelElem.innerText = "Nextbike bikesharing";
                break;
            case 'tier':
                // @ts-ignore
                labelElem.innerText = "Tier electric kick scooter sharing";
                break;
            default:
                // @ts-ignore
                labelElem.innerText = this.rideData.vehicle;
                break;
        }
        // @ts-ignore
        co2Elem.innerText = this.vehicleData.totalCo2.toFixed(2);
        // @ts-ignore
        kmElem.innerText = this.vehicleData.totalKm.toFixed(2);

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
        const makeAndModelElem = ride.querySelector(".make-and-model");
        const co2PerKmElem = ride.querySelector(".co2-per-km");

        switch (this.rideData.vehicle) {
            case "driveby":
                // @ts-ignore
                labelElem.innerText = "Miles carsharing";
                break;
            case 'nextbike':
                // @ts-ignore
                labelElem.innerText = "Nextbike bikesharing";
                break;
            case 'tier':
                // @ts-ignore
                labelElem.innerText = "Tier electric kick scooter sharing";
                break;
            default:
                // @ts-ignore
                labelElem.innerText = this.rideData.vehicle;
                break;
        }

        // @ts-ignore
        priceElem.innerText = this.rideData.price;
        // @ts-ignore
        co2Elem.innerText = this.rideData.co2.toFixed(2);
        // @ts-ignore
        kmElem.innerText = this.rideData.km.toFixed(2);
        const formatOptions = {year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"};
        const startTime = this.rideData.start.timestamp;
        // @ts-ignore
        startTimeElem.innerText = startTime.toLocaleDateString("en-US", formatOptions);
        const endTime = this.rideData.end.timestamp;
        // @ts-ignore
        endTimeElem.innerText = endTime.toLocaleDateString("en-US", formatOptions);
        // @ts-ignore
        makeAndModelElem.innerText = this.rideData.makeAndModel;
        // @ts-ignore
        co2PerKmElem.innerText = this.rideData.co2PerKm.toFixed(2);


        parent.appendChild(ride);
    }
}

class ScoreboardEntryElement {
    public constructor(private name: string, private co2PerKm: number, private isOwn: boolean) {}

    public addToHtml(parent: HTMLElement) {
        const proto = getPrototype(parent);

        const nameElem = proto.querySelector(".name");
        const co2PerKmElem = proto.querySelector(".co2PerKm");

        // @ts-ignore
        nameElem.innerText = this.name;
        if (this.co2PerKm === null) {
            // @ts-ignore
            co2PerKmElem.innerText = "None";
        } else {
            // @ts-ignore
            co2PerKmElem.innerText = _.round(this.co2PerKm, 2);
        }
        if (this.isOwn)
            proto.classList.add("own");

        parent.appendChild(proto);
    }
}

function showVehicles(vehiclesContainerId: string, vehicles: Vehicle[]) {
    const vehiclesContainer = document.getElementById(vehiclesContainerId);
    removeOldEntries(vehiclesContainer);
    vehicles.forEach((vehicle) => new VehicleElement(vehicle).addToHtml(vehiclesContainer));
}

function showRides(ridesContainerId: string, rides: EnrichedRide[]) {
    const ridesContainer = document.getElementById(ridesContainerId);
    removeOldEntries(ridesContainer);
    rides.forEach((ride) => new RideElement(ride).addToHtml(ridesContainer));
}

function showScoreboard(leaderBoardContainerId: string, board: Scoreboard) {
    const leaderBoardContainer = document.getElementById(leaderBoardContainerId);
    removeOldEntries(leaderBoardContainer);
    _.forEach(board.topScorers, (co2PerKm, name) => {
        const element = new ScoreboardEntryElement(name, co2PerKm, name === getCookie("email"));
        element.addToHtml(leaderBoardContainer);
    });
}

function convertRidesToVehicles(rides: EnrichedRide[]): Vehicle[] {
    const vehicles = new Map<string, Vehicle>();
    for (const ride of rides) {
        if (!vehicles.has(ride.vehicle)) {
            vehicles.set(ride.vehicle, {
               name: ride.vehicle,
               totalKm: ride.km,
               totalCo2: ride.co2
            });
        } else {
            const vehicle = vehicles.get(ride.vehicle);
            vehicle.totalKm += ride.km;
            vehicle.totalCo2 += ride.co2;
        }
    }
    return Array.from(vehicles.values());
}

export function showAndFetchScoreboard(containerId: string) {
    scoreboardApi.subscribeToScoreBoard(getCookie("email"), scoreboard => {
        showScoreboard(containerId, scoreboard);
    });
}

function calculateScore(rides: EnrichedRide[]): number {
    const drivenKilometers = _.sumBy(rides, (r: EnrichedRide) => r.km);
    const emittedCo2 = _.sumBy(rides, (r: EnrichedRide) => r.co2);

    if (drivenKilometers === 0)
        return Infinity;

    const avg = emittedCo2 / drivenKilometers;
    return avg;
}

export async function showRidesAndVehicles(ridesContainerId: string, vehiclesContainerId: string) {
    api.fetchHistory(getCookie("accessToken")).then(async (json) => {
        const rides = await Promise.all(api.generateRidesList(json)
            .map(async (ride) => await cdc.getEnrichedRide(ride)));
        const vehicles = convertRidesToVehicles(rides);

        const score = calculateScore(rides);
        scoreboardApi.publishScore(getCookie("email").toLocaleLowerCase(), score);

        showRides(ridesContainerId, rides);
        showVehicles(vehiclesContainerId, vehicles);
    });
}