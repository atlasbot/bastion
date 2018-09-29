module.exports = class Event {
	constructor(client) {
		this.client = client;
	}

	async execute(msg, emoji, userID) {
		if (!msg.author) {
			msg = await this.client.getMessage(msg.channel.id, msg.id);
		}
		if (msg.channel.guild && msg.author.bot && userID !== msg.author.id && msg.author.id === this.client.user.id) {
			const [embed] = msg.embeds;
			if (!embed || !embed.footer || embed.footer.text !== 'awaiting approval') {
				return;
			}

			msg.removeReaction(emoji.name, userID).catch(console.error);

			let member;

			const re = /#[0-9]{4} \(([0-9]+)\)/;
			const match = re.exec(embed.fields[0].value);
			if (match && match[1]) {
				member = msg.channel.guild.members.get(match[1]);
			}

			const content = embed.description;

			if (emoji.name === '✅') {
				msg.removeReactions().catch(() => false);
				const suggestionChannel = msg.channel.guild.channels.get(process.env.SUGGESTION_CHANNEL);

				const smsg = await suggestionChannel.createMessage({
					embed: {
						description: content,
						fields: [{
							name: 'Suggested By',
							value: member ? `${member.username}#${member.discriminator}` : 'Unknown',
						}],
						timestamp: new Date(),
					},
				});

				await smsg.addReaction(process.env.SUGGESTION_EMOJI_UP);
				await smsg.addReaction(process.env.SUGGESTION_EMOJI_DOWN);

				embed.footer.text = 'approved';
				embed.color = 3066993;
				msg.edit({
					content: `Approved by <@${userID}> at ${(new Date()).toLocaleDateString()}`,
					embed,
				});

				if (member) {
					const dmChannel = await member.user.getDMChannel();
					await dmChannel.createMessage({
						embed: {
							color: 3066993,
							title: 'Suggestion Approved',
							description: `Your suggestion ("${content.substring(0, 64)}"...) has been approved by the staff team and can now be voted on. 
                            
                            This doesn't mean your suggestion is being added just yet, it just means users can now vote on whether or not they want it added.
                            
                            You can view your suggestion in the <#${suggestionChannel.id}> channel.`,
							timestamp: new Date(),
						},
					});
				}
			} else if (emoji.name === '❌') {
				msg.removeReactions().catch(() => false);

				embed.footer.text = 'denied';
				embed.color = 15158332;
				msg.edit({
					content: `Denied by <@${userID}> at ${(new Date()).toLocaleDateString()}`,
					embed,
				});

				if (member) {
					const dmChannel = await member.user.getDMChannel();
					await dmChannel.createMessage({
						embed: {
							color: 15158332,
							title: 'Suggestion Denied',
							description: `Your suggestion ("${content.substring(0, 64)}"...) has been denied by the staff team. 
                            
                            If you want more information on why your suggestion was denied, please contact a staff member.`,
							timestamp: new Date(),
						},
					});
				}
			}
		}
	}
};
