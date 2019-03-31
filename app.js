const Discord = require("discord.js");
const puppeteer = require("puppeteer");
const striptags = require("striptags");
const cheerio = require("cheerio");
const settings = require("./settings");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Der Bot ist einsatzbereit.");
});

client.on("message", async msg => {
	if(!msg.content.startsWith(settings.CMD_PREFIX)) {
		return;
	}

	const cmd = msg.content.substring(1);
	const args = cmd.split(" ");

	const law = args[0];
	const article = args[1];
	const paragraph = args[2];

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// TODO: FEHLERBEHANDLUNG
	await page.goto(`https://dejure.org/gesetze/${law.toUpperCase()}/${article}.html`);

	let text = await page.evaluate((_paragraph) => {
		let elParagraph = document.getElementById(`g${_paragraph}`);
		return elParagraph.innerHTML;
	}, paragraph);

	const $ = cheerio.load(text, {
		decodeEntities: false
	});

	$(`html .n > a`).remove();

	const finalText = striptags($.html());

	msg.channel.send(finalText);
});

client.login(settings.DISCORD_TOKEN);