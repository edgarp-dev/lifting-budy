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
    <div class="h-screen">
      <Head>
        <title>Login</title>
      </Head>
      <div class="flex items-center justify-center p-4">
        <div class="rounded border border-gray-300 p-8 w-full max-w-md">
          <form
            method="POST"
            class="space-y-4"
          >
            <h2 class="text-center text-slate-800 text-2xl font-bold mb-6">Login</h2>
            {data?.errorMessage && (
              <div class="mb-4 p-2 bg-red-100 text-red-600 border border-red-400 rounded-sm">
                {data.errorMessage}
              </div>
            )}
            <div class="mb-4">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              class="w-full text-white font-semibold py-2 px-4 rounded transition-all bg-slate-800 hover:bg-gray-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
