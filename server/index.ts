import crypto from "node:crypto";
import z from "zod";

const msgs: Record<string, unknown>[] = [];

Bun.serve({
	port: 8000,

	routes: {
		"/": () => {
			return Response.json(msgs);
		},

		// Creates a new session ID used by the user's browser to
		// progress through the lessons.
		"/sessions": {
			POST: async () => {
				const sessionId = crypto.randomUUID();
				return Response.json({ sessionId });
			},
		},

		"/sessions/{sessionId}": async (req) => {
			// get current lesson
			return Response.json({ lessonId: 2 });
		},

		"/tcp": async (req) => {
			const json = TcpRequestSchema.parse(await req.json());
			const response = handleTcpRequest(json);

			msgs.push(json);

			return response;
		},
	},
});

const TcpRequestSchema = z.object({
	syn: z.boolean().optional(),
	ack: z.boolean().optional(),
	fin: z.boolean().optional(),
});

function handleTcpRequest(json: z.output<typeof TcpRequestSchema>) {
	if (json.syn) {
		return Response.json({
			syn: true,
			ack: true,
		});
	}

	return Response.json({ error: "Invalid input" }, { status: 400 });
}
