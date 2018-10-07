# discord-bot
Basic Discord Bot written in NodeJS. It doesn't do any thing fancy, just searches Google and returns the first result.

In order to use, you'll first need to create a Discord app and bot. Start here:

https://discordapp.com/developers/applications/

Once you have created both of these, you need to create an "auth.json" file at the root of this project with the following contents:

```
{
	"token": "<bot token>"
}
```

After that is done, start your bot (```npm start```) and invite it to your server:

https://discordapp.com/oauth2/authorize?&client_id=&lt;app client id&gt;&scope=bot&permissions=67584

Commands you can use:

```hey nexus! what is <term>```
```hey nexus! search for <term>```

