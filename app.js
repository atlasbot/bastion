if (process.env.NODE_ENV !== 'production' || !process.env.TOKEN) {
	require('./util/logger');

	console.log('Loading ".env" file');
	require('dotenv').config(); // eslint-disable-line global-require
}

const fs = require('fs').promises;
const Eris = require('eris');
const path = require('path');

const client = new Eris.CommandClient(process.env.TOKEN, {}, {
	prefix: ['b!', '@mention'],
	owner: process.env.OWNER,
	defaultHelpCommand: false,
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
	if (process.env.PLAYING) {
		client.editStatus('online', {
			name: process.env.PLAYING,
		});
	}
});


fs.readdir('./commands')
	.then((commands) => {
		for (const cmd of commands) {
			const Prop = require(path.join(__dirname, 'commands', cmd)); // eslint-disable-line global-require, import/no-dynamic-require
			const prop = new Prop(client);

			client.registerCommand(Prop.info.label, prop.execute.bind(prop), Prop.info);

			if (Prop.info.aliases) {
				Prop.info.aliases.forEach((a) => {
					if (client.commandAliases[a]) return;
					client.registerCommandAlias(a, Prop.info.label);
				});
			}
		}
		console.log(`Loaded ${commands.length} commands.`);
	});
fs.readdir('./events')
	.then((events) => {
		for (const event of events) {
			const Prop = require(path.join(__dirname, 'events', event)); // eslint-disable-line global-require, import/no-dynamic-require
			const prop = new Prop(client);

			client.on(event.split('.')[0], prop.execute.bind(prop));
		}
		console.log(`Loaded ${events.length} events.`);
	});

client.connect();
