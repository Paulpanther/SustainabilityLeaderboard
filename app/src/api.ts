import axios from "axios"

const BASE_URL = "https://whitelabel-app-api-bvg.trafi.com";

interface TokenPair {
    refreshToken: string;
    accessToken: string;
}

export async function fetchHistory(token: string) {
    const response = await axios.get(BASE_URL + "/v1/history", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    const json = response.data
    return json
}

/**
 * @returns a new token pair
 */
export async function refresh(refreshToken: string): Promise<TokenPair> {
    const response = await axios.post(
        BASE_URL + "/v1/users/refreshtoken",
        { refreshToken }
    );

    return response.data;
}

export async function signIn(email: string, password: string): Promise<TokenPair> {
    const response = await axios.post(BASE_URL + "/v1/users/signin", {
        acceptedTermKeys: ["terms", "privacy"],
        email,
        password
    })
    const json = response.data
    return json.authData;
}