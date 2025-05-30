import dgram from "node:dgram";

const client = dgram.createSocket("udp4");
const targetPort = 5000;
const targetHost = "137.66.39.113";

const message = Buffer.from("test packet");

let sent = 0;

const interval = setInterval(() => {
	for (let i = 0; i < 50; i++) {
		client.send(message, targetPort, targetHost, (err) => {
			if (err) console.error("Send error:", err);
		});
		sent++;
	}

	console.log(`Sent ${sent} packets...`);

	if (sent >= 1000) {
		clearInterval(interval);
		client.close();
		console.log("Done.");
	}
}, 100);
