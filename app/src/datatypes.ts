export interface Location {
    lon: number;
    lat: number;
}

export interface Spacetime {
    timestamp: Date;
    location: Location;
}

export interface Ride {
    vehicle: string;
    start: Spacetime;
    end: Spacetime;
    price: number;
    makeAndModel: string;
}

export interface EnrichedRide extends Ride{
    co2: number;
    km: number;
    co2PerKm: number;
}

export interface Vehicle {
    name: string;
    totalKm: number;
    totalCo2: number;
}