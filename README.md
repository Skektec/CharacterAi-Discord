# CharacterAi-Discord
An unofficial method of relaying Character.Ai chats through to a discord chat. 

# Finding your Token ID

1. Navigate to https://old.character.ai in your browser
2. Open the developer tools F12 and go to the Application tab.
3. Go to the Storage section and click on Local Storage > https://old.character.ai.
4. Look for char_token which should contain: ttl:XXXXXXX value:"".
5. Copy the key inside the "" from the value: area.
6. Stick it in a .env file located in the same folder as the .js file. (Make sure its written as CHARAI_TOKEN={yourTokenID})

# Release-V2

This one takes a bit of setup but overall is the best I currently have once completly setup. Due to it requiring each username and the corresponding user ID it can't really be used on large servers.
I'm working on a V3 to fix this issue but it's in a semi-working state and on hold as I complete finals.

# Troubleshooting

- One of the biggest issues I ran into was the authentication key not working correctly. From what I can tell it doesn't like being used by 2 devices at the same time but that's just a guess.
  Generally to fix this you can relogin at character.ai and wait a minute or so. I'm still figuring out a definitive fix.
