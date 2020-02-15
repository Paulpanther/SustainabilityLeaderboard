import axios from "axios"

export async function fetchHistory(token: string) {
    const response = await axios.get("https://whitelabel-app-api-bvg.trafi.com/v1/history", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    const json = response.data
    return json
}

export async function signIn(email: string, password: string) {
    const response = await axios.post("https://whitelabel-app-api-bvg.trafi.com/v1/users/signin", {
        acceptedTermKeys: ["terms", "privacy"],
        email,
        password
    })
    const json = response.data
    return json.authData.accessToken
}