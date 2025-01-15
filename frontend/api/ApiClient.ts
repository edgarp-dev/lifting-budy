import { getSessionToken } from "../auth/SessionManager.ts";

export async function get<T>(url: string, headers: Headers): Promise<T | undefined> {
    const sessionToken = getSessionToken(headers);

    return await makeGetRequest<T>(url, sessionToken);
}

export async function clientGet<T>(url: string, sessionToken: string): Promise<T | undefined> { 
    return await makeGetRequest<T>(url, sessionToken);
}

async function makeGetRequest<T>(url: string, sessionToken: string): Promise<T | undefined> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
        },
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

export async function clientPut<T>(url: string, sessionToken: string, body: any): Promise<T | undefined> {
    const response = await fetch(url, {
        method: "PUT",
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
