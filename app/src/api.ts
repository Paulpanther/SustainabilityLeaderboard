import axios from "axios";

const trafi = axios.create({
    baseUrl: "https://whitelabel-app-api-bvg.trafi.com",
})

interface TokenPair {
    refreshToken: string;
    accessToken: string;
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
    const response = await trafi.post(
        "/v1/users/signin",
        {
            email,
            password,
            acceptedTermKeys: ["terms", "privacy"],
        }
    );
    return response.data.authData;
}