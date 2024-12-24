import { type PageProps } from "$fresh/server.ts";
import { HandlerContext } from "$fresh/server.ts";
import { requireAuth } from "../auth/authMiddleware.ts";
import { protectedRuotes } from "./routes.ts";

export const handler = {
	async GET(req: Request, ctx: HandlerContext) {
		const url = new URL(req.url);
		if (protectedRuotes.includes(url.pathname)) {
			const authReponse = await requireAuth(req);
			console.log(authReponse);

			if (authReponse) {
				return authReponse;
			}
		}
	},
};

export default function App({ Component }: PageProps) {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Lifting Buddy</title>
				<link href="/tailwind.css" rel="stylesheet" />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
}
