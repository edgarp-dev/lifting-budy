import { FreshContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { setSession } from "../../auth/SessionManager.ts";

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const baseUrl = Deno.env.get("BASE_URL");
    const response = await fetch(
      `${baseUrl}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresAt = data.expires_at;
      const userId = data.userId;

      const headers = new Headers();

      setSession({ accessToken, refreshToken, expiresAt, userId }, headers);

      headers.set("location", "/routines");
      return new Response(null, {
        status: 302,
        headers,
      });
    } else {
      const errorMessage = "Bad credentials";
      return ctx.render({ ...ctx.state, errorMessage });
    }
  },
};

export default function LoginPage({
  data,
}: PageProps<{ errorMessage?: string }>) {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div class="flex items-center justify-center h-screen bg-gray-100">
        <form
          method="POST"
          class="max-w-md w-full p-6 shadow-lg rounded-lg bg-white"
        >
          <h2 class="text-center text-2xl font-bold mb-6">Login</h2>
          {data?.errorMessage && (
            <div class="mb-4 p-2 bg-red-100 text-red-600 border border-red-400 rounded-sm">
              {data.errorMessage}
            </div>
          )}
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            class="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}
