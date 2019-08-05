import * as Discord from "discord.js"
import * as config from "../perms.json"
import * as rosters from "rosters.json"

const client = new Discord.Client()

client.on("ready", () => {
  	client.user.setActivity('Frankenstein');
})

client.on("message", async message => {
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();
	return message.reply(rosters[command])
}
)
client.login(config.token)