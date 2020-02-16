// @ts-ignore
import axios from "axios";
import { Ride } from "./datatypes";

const corsProxy = "https://sustainability-scoreboard-api.simonknott.de/";

const trafi = axios.create({
    baseURL: corsProxy + "https://whitelabel-app-api-bvg.trafi.com",
})

//const vehicleTypeMap = new Map([['tier','Kickscooter-Sharing'],['nextbike','Bike-Sharing'],['sts','Bahn & Bus'],['driveby','Car-Sharing'],['emmy','Scooter-Sharing']])

const monthMap = new Map([['Jan',0],['Feb',1],['Mar',2],['Apr',3],['May',4],['Jun',5],['Jul',6],['Aug',7],['Sep',8],['Oct',9],['Nov',10],['Dec',11]])

interface TokenPair {
    refreshToken: string;
    accessToken: string;
    refreshTokenExpiresAt: string;
    accessTokenExpiresAt: string;
}

export async function fetchHistory(accessToken: string) {
    const response = await trafi.get(
        "/v1/history",
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    );

    return response.data;
}

export function generateRidesList(json) : Ride[] {
    const rides = []
    json.periods.forEach(period => {
        period.items.forEach(ride => {
            if(ride.vehicleSharing){
                const convDate = ride.vehicleSharing.date.split(" ")
                const convStartTime = convDate[3].split(":")
                const convEndTime = convDate[5].split(":")
                const convertedRide = {
                    vehicle : ride.vehicleSharing.providerIcon,
                    makeAndModel: ride.vehicleSharing.brandAndModel,
                    start : {
                        timestamp: new Date(2020, monthMap.get(convDate[0]), parseInt(convDate[1]), parseInt(convStartTime[0]), parseInt(convStartTime[1])),
                        location: 
                            {lon : ride.vehicleSharing.start.coordinate.lng, lat : ride.vehicleSharing.start.coordinate.lat}
                    },
                    end : {
                        timestamp: new Date(2020, monthMap.get(convDate[0]), parseInt(convDate[1]), parseInt(convEndTime[0]), parseInt(convEndTime[1])),
                        location: 
                            {lon : ride.vehicleSharing.end.coordinate.lng, lat : ride.vehicleSharing.end.coordinate.lat}
                    },
                    price: parseFloat(ride.vehicleSharing.payment.price.substring(1))
                }
                rides.push(convertedRide)
            }
        });
    });
    return rides;
}

/**
 * @returns a new token pair
 */
export async function refresh(refreshToken: string): Promise<TokenPair> {
    const response = await trafi.post(
        "/v1/users/refreshtoken",
        { refreshToken }
    );

    return response.data;
}

export async function signIn(email: string, password: string): Promise<TokenPair> {
    return {
        accessToken: "ad",
        refreshToken: "asda",
        accessTokenExpiresAt: "ads",
        refreshTokenExpiresAt: "asd",
    };
    const response = await trafi.post(
        "/v1/users/signin",
        {
            email,
            password,
            acceptedTermKeys: ["terms", "privacy"],
        }
    );
    console.log(response.data.authData);
    return response.data.authData;
}