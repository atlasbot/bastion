module.exports = class Event {
	constructor(client) {
		this.client = client;
	}

	async execute(msg) {
		if (msg.type === 0 && !msg.author.bot && msg.channel.guild && msg.channel.id === process.env.SUGGESTION_CHANNEL) {
			const { content } = msg;
			const verifyChannel = msg.channel.guild.channels.get(process.env.VERIFY_CHANNEL);
			const smsg = await verifyChannel.createMessage({
				embed: {
					title: 'New Suggestion',
					description: content,
					fields: [{
						name: 'Suggested By',
						value: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
						inline: true,
					}],
					footer: {
						text: 'awaiting approval',
					},
					timestamp: new Date(),
				},
			});

			await smsg.addReaction('✅');
			await smsg.addReaction('❌');

			await msg.delete();

			const dmChannel = await msg.author.getDMChannel();
			await dmChannel.createMessage({
				embed: {
					title: 'Suggestion Pending Approval',
					description: `Your suggestion ("${content.substring(0, 64)}"...) is now pending approval. 
					
					If the staff team approves it, your suggestion will be voted on. If your suggestion gets enough votes, it could be added to Atlas.`,
					timestamp: new Date(),
				},
			});
		}
	}
};
