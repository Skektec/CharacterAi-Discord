const fs = require('node:fs')
const path = require('node:path')
require('dotenv').config()

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const CharacterAI = require('node_characterai')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Ensure these intents are enabled in the Developer Portal.
    ],
})

client.commands = new Collection()

const characterAI = new CharacterAI()

const messages = {
    discordToAI: [],
    aiToDiscord: [],
}

let chat

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            )
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        )
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            })
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            })
        }
    }
})

async function initializeBot() {
    try {
        console.log('Authenticating with CharacterAI...')
        await characterAI.authenticateWithToken(process.env.CHARAI_TOKEN)

        const characterId = process.env.CHARACTER_ID

        chat = await characterAI.createOrContinueChat(characterId)

        const prompt = 'Hello.'

        console.log('Sending initial prompt to CharacterAI: ' + prompt)
        const response = await chat.sendAndAwaitResponse(prompt, true)

        if (response && response.length > 0) {
            const aiResponse = response[0]

            if (aiResponse.text && aiResponse.text.trim().length > 0) {
                const channel = client.channels.cache.get(
                    process.env.DISCORD_CHANNEL_ID
                )
                if (channel) {
                    await channel.send(aiResponse.text)
                } else {
                    console.error('Channel not found.')
                }
            }
        } else {
            console.log('No AI Response found')
        }

        console.log('Logging in to Discord...')
        await client.login(process.env.DISCORD_TOKEN)
        console.log('Bot is Online')
    } catch (err) {
        console.error('Error during initialization:', err)
    }
}

function modifyMessage(message, pingReplacements) {
    if (typeof message !== 'string') {
        console.error('Invalid message type for modifyMessage:', message)
        return ''
    }
    pingReplacements.forEach((pair) => {
        const regex = new RegExp(pair.target, 'g')
        message = message.replace(regex, pair.replacement)
    })
    return message
}

client.on('messageCreate', async (message) => {
    try {
        if (
            message.mentions.has(client.user.id) &&
            message.author.id != client.user.id
        ) {
            const Dmessage = message

            let userMessage = await DiscordMessage(Dmessage)

            if (!userMessage) {
                return
            }

            let response
            try {
                response = await chat.sendAndAwaitResponse(userMessage)
            } catch (err) {
                console.error(
                    'Error while sending message to CharacterAI:',
                    err
                )
                await message.channel.send(
                    'Hey! Stop flirting or talking about explicit content!'
                )
                return
            }

            if (response && response.length > 0) {
                const aiResponse = response[0]
                console.log('AI Response:', aiResponse.text)

                let aiDiscordReply = AIMessage(aiResponse.text, Dmessage)

                if (aiDiscordReply && aiDiscordReply.trim().length > 0) {
                    await message.reply(aiDiscordReply)
                }
            } else {
                console.log('No AI Response found')
            }
        }
    } catch (err) {
        console.error('Error in messageCreate event:', err)
    }
})

async function DiscordMessage(Dmessage) {
    let pingReplacements = [
        {
            target: `<@${client.user.id}>`,
            replacement: client.user.username,
        },
        {
            target: `<@${Dmessage.author.id}>`,
            replacement: Dmessage.author.globalName || Dmessage.author.username,
        },
    ]

    messages.discordToAI.push(Dmessage.content)

    let modifiedMessage = modifyMessage(Dmessage.content, pingReplacements)
    console.log('Modified Message: ' + modifiedMessage)

    let send = `${Dmessage.author.username}: ${modifiedMessage}`

    return send
}

function AIMessage(Cresponse, Dmessage) {
    let pingReplacements = [
        {
            target: client.user.username,
            replacement: `<@${client.user.id}>`,
        },
        {
            target: Dmessage.author.globalName || Dmessage.author.username,
            replacement: `<@${Dmessage.author.id}>`,
        },
    ]

    messages.aiToDiscord.push(Cresponse)

    let modifiedMessage = modifyMessage(Cresponse, pingReplacements)
    console.log('Modified Message: ' + modifiedMessage)

    let receive = modifiedMessage

    return receive
}

initializeBot()
