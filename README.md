# CharacterAi-Discord
An unofficial method of relaying Character.Ai chats through to a discord chat. 

# Setup

1. Clone the repo.
2. Navigate to the folder and run npm i. (You may need to install nodejs if it is not already installed.)
3. Before running you will need to create a .env file for tokens and such.
 - Make a file named .env in the folder that the releaseVX.js is located in.
 - Inside that folder we need 4 fields: CHARAI_TOKEN, CHARACTER_ID, DISCORD_CHANNEL_ID and DISCORD_TOKEN. Setup like the following
```
CHARAI_TOKEN=
CHARACTER_ID=
DISCORD_CHANNEL_ID=
DISCORD_TOKEN=
````
 - Get your CHARAI_TOKEN by following these steps: https://github.com/Skektec/CharacterAi-Discord?tab=readme-ov-file#finding-your-token-id
 - Get your CHARACTER_ID by copying the value after https://character.ai/chat/ when in the chat you would like to bring over to discord.
 - To get the DISCORD_CHANNEL_ID by doing the following, in this case it doesnt really matter which channel as far as I can tell. ![image](https://github.com/user-attachments/assets/5a4eb1fd-f070-4616-a7e2-5e9dba807373)
 - Finally get the DISCORD_TOKEN in the Discord Developer portal > Applications > {Your Application} > Bot. You may need to reset it.
4. Now you can run by typing ``` node releaseVX.js ```, X being the version.


## Finding your Token ID

1. Navigate to https://old.character.ai in your browser
2. Open the developer tools F12 and go to the Application tab.
3. Go to the Storage section and click on Local Storage > https://old.character.ai.
4. Look for char_token which should contain: ttl:XXXXXXX value:"".
5. Copy the key inside the "" from the value: area.
6. Stick it in a .env file located in the same folder as the .js file. (Make sure its written as CHARAI_TOKEN={yourTokenID})

## Release-V2

This one takes a bit of setup but overall is the best I currently have once completly setup. Due to it requiring each username and the corresponding user ID it can't really be used on large servers.
I'm working on a V3 to fix this issue but it's in a semi-working state and on hold as I complete finals.

## Troubleshooting

- One of the biggest issues I ran into was the authentication key not working correctly. From what I can tell it doesn't like being used by 2 devices at the same time but that's just a guess.
  Generally to fix this you can relogin at character.ai and wait a minute or so. I'm still figuring out a definitive fix.
