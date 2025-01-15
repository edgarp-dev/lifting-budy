import { getCookies } from "https://deno.land/std@0.223.0/http/cookie.ts";
import { isSessionExpired, setSession } from "./SessionManager.ts";

export async function requireAuth(req: Request): Promise<Response | undefined> {
  const headers = new Headers();

  try {
    const cookies = getCookies(req.headers);
    const token = cookies.access_token;

    if (!token) {
      headers.set("Location", "/login");
      return new Response("Unauthorized", { status: 302, headers });
    }

    if (isSessionExpired(req.headers)) {
      console.log("Token expired");
      const refreshTokenCookie = cookies.refresh_token;
      const refreshResponse = await fetch(
        "https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: refreshTokenCookie,
          }),
        },
      );

      const data = await refreshResponse.json();
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      const expiresAt = data.session.expires_at;
      const userId = data.userId;

      setSession({ accessToken, refreshToken, expiresAt, userId }, headers);
    }

    return undefined;
  } catch (error) {
    console.error(error);

    headers.set("Location", "/login");
    return new Response("Invalid session", {
      status: 302,
      headers,
    });
  }
}
