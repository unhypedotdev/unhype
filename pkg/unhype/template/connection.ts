const BASE_URL = "http://localhost:8000";

export const Connection = {
	async send(packet: Record<string, unknown>) {
		await fetch(`${BASE_URL}/api`, {
			method: "POST",
			body: JSON.stringify(packet),
		});
	},
};
