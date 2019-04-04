import { Client } from "discord.js";
import { BotSettings } from "./model/typings";

export class Bot {

	private client: Client;

	public start(settings: BotSettings) {
		this.client = new Client();

		this.client.on("ready", () => {
			console.log("This bot is ready.");
		});

		this.client.login(settings.LOGIN_TOKEN);
	}

}