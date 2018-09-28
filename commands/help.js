module.exports = class Command {
	constructor(client) {
		this.client = client;
	}

	async execute(msg) {
		// im lazy
		const { client } = this;
		const commands = Object.keys(client.commands);

		return client.createMessage(msg.channel.id, {
			embed: {
				title: 'Need some help?',
				description: `${commands.map(c => `\`gp!${c}\` - ${client.commands[c].description}`).join('\n')}`,
				timestamp: new Date(),
			},
		});
	}
};

module.exports.info = {
	label: 'help',
	aliases: [
		'commands',
		'hepl',
		'ehlp',
		'hlp',
	],
	description: 'A list of available commands.',
};
