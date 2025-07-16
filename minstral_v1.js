const data = require('./config.json')
const messages = [{ role: 'system', content: data.systemPrompt }]
const { Client, GatewayIntentBits, Partials } = require('discord.js')

async function sendMessage(userMessage) {
    messages.push({ role: 'user', content: userMessage })

    try {
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.apiKey}`,
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages,
            }),
        })

        if (!res.ok) {
            const errorDetails = await res.text()
            throw new Error(
                `Mistral API error: ${res.status} - ${errorDetails}`
            )
        }

        const response = await res.json()
        const reply = response.choices?.[0]?.message?.content

        messages.push({ role: 'assistant', content: reply })
        return reply
    } catch (error) {
        console.error('Error in sendMessage:', error)
        throw error
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
})

client.login(data.discordToken)

client.on('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return

    if (message.content.trim().toLowerCase() === '!clear') {
        messages.length = 0
        messages.push({ role: 'system', content: data.systemPrompt })
        message.reply('Memory cleared!')
        return
    }

    if (message.channel.isDMBased()) {
        const user = await client.users.fetch(message.author.id)
        sendMessage(message.content)
            .then((reply) => user.send(reply))
            .catch((err) => {
                console.error('Error replying to DM:', err)
                user.send('Sorry, there was an error processing your request.')
            })
    } else if (message.mentions.has(client.user.id)) {
        sendMessage(message.content)
            .then((reply) => message.reply(reply))
            .catch((err) => {
                console.error('Error replying:', err)
                message.reply(
                    'Sorry, there was an error processing your request.'
                )
            })
    }
})
