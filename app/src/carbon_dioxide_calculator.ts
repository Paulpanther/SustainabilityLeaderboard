import {Location, Spacetime, Ride, EnrichedRide} from './datatypes';

function getCo2PerKm(ride: Ride) {
    switch (ride.vehicle) {
        case 'driveby':
            return 105;
            break;
        case 'nextbike':
            return 0;
            break;
        case 'tier':
            return 4.7;
            break;
        default:
            return 0;
            break;
    }
}

function getDistance(start: Location, end: Location): number {
    if ((start.lat == end.lat) && (start.lon == end.lon)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * start.lat/180;
        const radlat2 = Math.PI * end.lat/180;
        const theta = start.lon-end.lon;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
}

export function getEnrichedRide(ride: Ride): EnrichedRide {
    const km = getDistance(ride.start.location, ride.end.location);
    const co2PerKm = getCo2PerKm(ride);
    const co2 = co2PerKm * km;
    return {
        ...ride,
        co2,
        km,
        co2PerKm
    }
}
