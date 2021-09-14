const insults = Array(
    "Stupide porc.", //Valoosa
    "Déchet.", //Valoosa
    "B-Baka !", //Whenever
    "Ta waifu ne t'aime même pas", //Valoosa
    "Désolée de parler comme ça... ||Non sérieusement t'y as cru ?||", //Walid
    "tu pu.", //Muno
    ":nauseated_face:", //Walid
    "Au niveau bagage intellectuel, tu voyages léger.", //Walid
    "Pleure", //Sora
    "Je n'ai pas envie de t'insulter, j'ai peur de salir l'insulte", // Sora
    "Une créature comme toi ayant un cerveau résidant dans son crâne... est déjà un miracle en soi.", //Whenever
    "Je suis surpris que tu saches des choses aussi inutiles. C'est la première fois depuis ma naissance que je t'admire.", //Whenever
    "Imbécile ! Ne crache pas pendant que tu parles ! Ta virginité pourrait être contagieuse !", //Whenever
    "Lave ton clavier gros dégueulasse !", //Whenever
    "Espèce de fasme !", // Bokansha
    "Voleur de gouté de Xeo !", //Whenever
    "Je préfère Sushi" //Whenever
);

require('dotenv').config()

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { token, starboard_id, guild_id, users } = require("./config.json");
const fs = require('fs');

let lastMessages = {};

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', message => {

    if(message.author.bot) return;

    const p = Math.random();
    if(p <= 0.007) {

        if (p <= 0.0007) {

            switch (message.author.id) {
                case users.Sora :
                    message.reply("Sale monocouille");
                    break;
                
                case users.Whenever__:
                    message.reply("Joueur Osu!.");
                    break;
            };

        } else {
            const randomInsult = Math.floor(Math.random()*insults.length);

            message.reply({ 
                content: insults[randomInsult], 
                allowedMentions: { repliedUser: true }
            });
        };
    };

    const punctuation = new RegExp(/[.,\/#!?!$%\^&\*;:{}=\-_`~()]/, "g")

    if (message.content.replace(punctuation, "").toLowerCase().trim().endsWith('quoi')) {
        message.reply('feur');
    };

});

client.on('messageReactionAdd', async (reaction, user) => {

    if(reaction.emoji.name !== "⭐") return;
    if(reaction.message.author.id === client.user.id) return;

    const OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
    const starboard = client.guilds.cache.get(guild_id).channels.cache.get(starboard_id);

    const embedReact = new MessageEmbed()
        .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
        .setDescription(reaction.message.content)
        .setFooter(`ID: ${reaction.message.id}`)
        .setTimestamp()
        .setColor("#FFAC33");

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Voir')
                .setStyle('LINK')
                .setURL(reaction.message.url)
        );

    if(reaction.message.attachments.size > 0 && reaction.message.attachments.first().contentType === "image") {
        embedReact.setImage(reaction.message.attachments.first().url);

    } else if (reaction.message.embeds[0]) embedReact.setImage(reaction.message.embeds[0].url);
    

    if(reaction.message.id in lastMessages) {
        let sendedMessage = await starboard.messages.fetch();

        sendedMessage.get(lastMessages[reaction.message.id]).edit({ 
            content: `${reaction.message.reactions._cache.get("⭐").count} ⭐ | ${reaction.message.channel.toString()}`, 
            embeds: [embedReact], 
            components: [row]
        });

    } else {

        starboard.send({ 
            content: `${reaction.message.reactions._cache.get("⭐").count} ⭐ | ${reaction.message.channel.toString()}`, 
            embeds: [embedReact], 
            components: [row]
        }).then(msg => {
    
            if(reaction.message.createdAt < OneDay){

                const lastMessagesKeys = Object.keys(lastMessages);

                if(lastMessagesKeys.length >= 10){

                    delete lastMessages[lastMessagesKeys[0]];
                    
                    lastMessages[reaction.message.id] = msg.id;
                    console.log(`Adding : ${reaction.message.id}: ${msg.id}`);

                } else {
                    lastMessages[reaction.message.id] = String(msg.id);
                };
                
            };
    
        });
    };

});

client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(process.env.BOT_TOKEN);