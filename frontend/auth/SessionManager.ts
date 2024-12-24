import { setCookie, getCookies } from "https://deno.land/std@0.223.0/http/cookie.ts";

export type UserSession = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string
}
export const setSession = (userSession: UserSession, headers: Headers): void => {
    const { accessToken, refreshToken, expiresAt } = userSession;

    setSecureCookie("access_token", accessToken, headers);
    setSecureCookie("refresh_token", refreshToken, headers);
    setSecureCookie("expires_at", expiresAt, headers);   
}

const setSecureCookie = (name: string, value: string, headers: Headers): void => {
    const isProduction = Deno.env.get("ENV") === "production";

    setCookie(headers, {
        name,
        value,
        httpOnly: true,
        secure: isProduction,
        path: "/",
        sameSite: "Lax",
        maxAge: 3600
    });
}

export const isSessionExpired = (headers: Headers): boolean => {
    const cookies = getCookies(headers);
    const expiresAt = parseInt(cookies.expires_at);

    return isTokenExpired(expiresAt);
}

const isTokenExpired = (expiresAt: number): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= expiresAt;
}