import { getSessionToken } from "../auth/SessionManager.ts";

export async function get<T>(url: string, headers: Headers): Promise<T | undefined> {
    const sessionToken = getSessionToken(headers);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json", 
        }
    });

    if (!response.ok) {
        return undefined;
    }

    const responseData = await response.json();

    return responseData as T;
}

export async function post<T>(url: string, headers: Headers, body: any): Promise<T | undefined> {
    const sessionToken = getSessionToken(headers);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return undefined;
    }

    const responseData = await response.json();

    return responseData as T;
}