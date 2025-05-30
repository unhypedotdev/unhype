import dgram from "node:dgram";

const udpPort = 5000;
const httpTarget = "https://example.com/endpoint";

const udpServer = dgram.createSocket("udp4");

udpServer.on("message", async (msg, rinfo) => {
	console.log(`Received ${msg} from ${rinfo.address}:${rinfo.port}`);

	try {
		await fetch(httpTarget, {
			method: "POST",
			headers: { "Content-Type": "application/octet-stream" },
			body: JSON.stringify({ msg, rinfo }),
		});
		console.log("Forwarded via HTTP");
	} catch (err) {
		console.error("HTTP forward error:", err);
	}
});

udpServer.bind(udpPort, () => {
	console.log(`UDP server listening on ${udpPort}`);
});
