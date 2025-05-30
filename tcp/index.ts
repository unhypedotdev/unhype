import { Connection } from "./api";

function sendSyn() {
	Connection.send({ syn: true });
}
