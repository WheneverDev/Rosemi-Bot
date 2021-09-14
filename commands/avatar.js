const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Link avatar'),

	async execute(interaction) {
        
		return interaction.reply(interaction.user.avatarURL({ dynamic: true }));
	}
};