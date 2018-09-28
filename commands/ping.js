module.exports = class Command {
	constructor(client) {
		this.client = client;
	}

	async execute(msg) {
		// im lazy
		const { client } = this;
		const botMsg = await client.createMessage(msg.channel.id, {
			content: 'Poking the server...',
		});

		return botMsg.edit({
			content: `I have a \`${(botMsg.timestamp - msg.timestamp).toLocaleString()}ms\` delay to this server.`,
		});
	}
};

module.exports.info = {
	label: 'ping',
	aliases: [
		'test',
	],
	description: 'Check the delay between the bot and your server.',
};
