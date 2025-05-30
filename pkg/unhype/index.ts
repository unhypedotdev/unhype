#!/usr/bin/env bun

import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { exec } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import open from "open";

const CONFIG_FILE = ".unhype.json";
const API_BASE = "http://localhost:8000";

function srcPath(...paths: string[]): string {
	return join(import.meta.dirname, ...paths);
}

function dstPath(...paths: string[]): string {
	return join(process.cwd(), ...paths);
}

async function main() {
	try {
		const configPath = dstPath(CONFIG_FILE);

		if (existsSync(configPath)) {
			// Config exists - open session
			const config = JSON.parse(await Bun.file(configPath).text());
			const sessionId = config.sessionID;

			if (!sessionId) {
				console.error(
					chalk.red("Error: Invalid config file - missing sessionID"),
				);
				process.exit(1);
			}

			console.log(chalk.blue("Opening session in browser..."));
			await open(`${API_BASE}/sessions/${sessionId}`);
		} else {
			// No config - create new session
			const folderName = await input({
				message: "Enter folder name for the session:",
				default: "unhype",
			});

			console.log(
				chalk.yellow(`Creating project structure under ${folderName}...`),
			);

			const folderPath = dstPath(folderName);
			if (!existsSync(folderPath)) {
				mkdirSync(folderPath, { recursive: true });
			}

			const response = await fetch(`${API_BASE}/sessions`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ course: "tcp" }),
			});

			if (!response.ok) {
				throw new Error(`Failed to create session: ${response.statusText}`);
			}

			const data = (await response.json()) as
				| { sessionId?: string }
				| undefined;

			const sessionId = data?.sessionId;
			if (!sessionId) {
				throw new Error("No session ID received from server");
			}

			// Save files
			const config = { sessionID: sessionId };
			writeFileSync(
				dstPath(folderName, CONFIG_FILE),
				JSON.stringify(config, null, 2),
			);
			writeFileSync(
				dstPath(folderName, "connection.ts"),
				await Bun.file(srcPath("template/connection.ts")).text(),
			);
			writeFileSync(
				dstPath(folderName, "package.json"),
				await Bun.file(srcPath("template/package.json")).text(),
			);
			writeFileSync(
				dstPath(folderName, "index.ts"),
				await Bun.file(srcPath("template/index.ts")).text(),
			);

			console.log(chalk.gray("$ npm install"));
			exec("npm install");

			console.log(chalk.green("✓ Project created successfully!"));

			await open(`${API_BASE}/sessions/${sessionId}`);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(chalk.red("Error:"), error.message);
		} else {
			console.error(chalk.red("An unexpected error occurred:"), error);
		}
		process.exit(1);
	}
}

main();
