# CharacterAi-Discord
An unofficial method of relaying Character.Ai chats through to a discord chat. 

# Setup

1. Clone the repo.
2. Navigate to the folder and run ```npm i```. (You may need to install nodejs if it is not already installed.)
3. Before running you will need to create a .env file for tokens and such.
 - Make a file named .env in the folder that the releaseVX.js is located in.
 - Inside that folder we need 4 fields: CHARAI_TOKEN, CHARACTER_ID, DISCORD_CHANNEL_ID and DISCORD_TOKEN. Setup like the following;
```
CHARAI_TOKEN=
CHARACTER_ID=
DISCORD_CHANNEL_ID=
DISCORD_TOKEN=
````
 - Get your CHARAI_TOKEN by following these steps: https://github.com/Skektec/CharacterAi-Discord?tab=readme-ov-file#finding-your-token-id
 - Get your CHARACTER_ID by copying the value after https://character.ai/chat/ when in the chat you would like to bring over to discord.
 - To get the DISCORD_CHANNEL_ID by doing the following, in this case it doesnt really matter which channel as far as I can tell.
![image](https://github.com/user-attachments/assets/5a4eb1fd-f070-4616-a7e2-5e9dba807373)
 - Finally get the DISCORD_TOKEN in the Discord Developer portal > Applications > {Your Application} > Bot. You may need to reset it.
4. Now you can run by typing ``` node releaseVX.js ```, X being the version.


## Finding your Token ID (It's been moved. I will have to find where too.)

1. Navigate to https://old.character.ai in your browser, it will redirect you but that is intentional.
2. Open the developer tools F12 and go to the Network tab.
3. Scroll all the way to the top till you find an entry named beta.character.ai:
<img width="887" alt="Screenshot 2024-10-09 at 19 48 30" src="https://github.com/user-attachments/assets/f35389e9-e615-413a-ae1d-c8220d706afc">

5. Click on the name and a window will open.
6. We're looking in the cookies tab for an entry named "HTTP_AUTHORIZATION"
7. Next to that entry there is a coloumn that has "Token XXXXXX", we want the value written after Token.

If this doesn't work make an issue, Character.ai seems to move it around occasionally.

## Release-V2

This one takes a bit of setup but overall is the best I currently have once completly setup. If you want the bot to understand a ping of itself, other bots and other users you will need to manually enter the name and user_id. This is because it is picked up as just a user id currently which is then passed to the bot. 

This means the bot sees "XXXXXXX: Hi" or "XXXXX: Say hello to XXXXXX", the X's being user id's. Inside the code you will find comments that instruct how to add user names for bot to understand. This isn't really necessary but can help when the bot talks to other bots and when it sees a ping.

## Beta-V3

Unlike V2 this should work right out of the gate. I had it marked as in "semi-working" state but after running brief tests it seemed fine. I'm leaving it as beta just incase I notice issues but I do still recommened it.

## Troubleshooting

- One of the biggest issues I ran into was the authentication key not working correctly. From what I can tell it doesn't like being used by 2 devices at the same time but that's just a guess.
  Generally to fix this you can relogin at character.ai and wait a minute or so. I'm still figuring out a definitive fix.
