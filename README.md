# ClipsTime!

ClipsTime! is a single-page web application intended to enhance the experience of watching Twitch clips for streamers, viewers, and moderators.

## How to use

1. **Access the ClipsTime! interface** -- the current version is available [here at https://clipstime.manapool.nyc](https://clipstime.manapool.nyc) or deploy it yourself using the development instructions below.
2. **Log in with Twitch.** (A quick note on permissions: Although the authentication message will ask for permission to view your email, ClipsTime! is never aware of it, and neither are its developers. Additionally, it will request permission to read and write chat messages on your behalf. At present, it only uses these permissions to read chat messages and never writes them; in the future, broadcasters and moderators will be able to access the chat API using the GUI.)
3. **Add a channel to collect activity from.** using the "add channel" box. Now, as clips and related messages are posted, the activity will be reflected in the ClipsTime! interface.

For more on how users, moderators, and broadcasters can take advantage of ClipsTime! by tagging, voting on, and taking moderation actions on clips posted in chat, please read on for a breakdown of the chat API.

## Chat API

ClipsTime! revolves around Twitch chat. As such, all of its functionality can be accessed via chat commands. Likewise, like Twitch Chat, it operates in a real-time basis and only knows what's happened in chat during the time that it's been open. ClipsTime! also supports moderation actions -- if moderators remove a single message or time a user out and remove all their recent messages, ClipsTime! will forget about their recent clips and commands.

When ClipsTime! is recording chat activity, a channel's users can interact with it using the following commands:

### Submit a Clip (All Chatters)

To submit a clip, all chatters can simply post a link in chat. This should be the full URL, in either of the common forms ("https://clips.twitch.tv/[__clip slug__]" or "https://www.twitch.tv/[__broadcaster__]/[__clip slug__]").

### Upvote / Downvote a clip (All Chatters)

To upvote or downvote a clip, a user can:
* reply to a message containing the clip with "+1" or "-1"
* repost the link and append "+1" or "-1"

### Tag a clip (All chatters)

Tags must be 3 or more characters long, and separated from each other and a clip link (if included in the same message) by a space.

To tag a clip, a user can:
* reply to the message with tags (words)
* repost the link and add tags (words)

### Mark a clip as Meta or Drama (All chatters, kind of)

"Meta" and "Drama" are special tags. While any user can submit them, ClipsTime! highlights "meta" and "drama" tags submitted by channel moderators or the channel's broadcaster. This is intended to mitigate abuse or human error on the part of normal chatters, while allowing broadcasters and their mods to add clear advisories for sensitive content.

To mark a clip as "meta" or "drama, a user can:
* reply to the message with "meta" or "drama"
* repost the link and append "meta" or "drama" after the link

### Veto a clip (Mods and Broadcasters only)

The final special command is "veto". Only a channel's moderators and broadcasters can submit them, and by default, vetoed clips are removed entirely from the ClipsTime! display. This is probably best reserved for clips that contain DMCA audio or other objectionable content, though your mileage may vary.

To VETO a clip, a mod or channel owner can:
* reply to a message containing the clip with a message containing the word "veto"
* repost the clip link and add the word "veto"

### Veto another user's message (clip links, tags, etc):

Moderators can completely remove the effects of a user's message from the ClipsTime! display by deleting that message or timing that user out in chat.

### Develop ClipsTime!

Anybody can download ClipsTime! and run it locally on their computers with full functionality, provided they have node.js 14+ and git. You will, however, need to supply a Twitch Client ID provided by the [Twitch dev console](https://dev.twitch.tv/console/apps). (Make sure to configure the application's OAuth redirect URL as 'https://localhost:3000/signin-oidc').

To clone the app locally, you can use the following command:

> git clone https://github.com/timfitzzz/twitch-clipcatcher.git
> cd ./twitch-clipcatcher

Then, to install its dependencies, either:

> npm install

or

> yarn

Now, Twitch-provided Client ID in hand, copy the /src/.env.example file to a new file in /src called '.env'. Within that file, replace the line: 

> REACT_APP_TWITCH_CLIENT_ID=000000000000000000000000000000

with

> REACT_APP_TWITCH_CLIENT_ID=[Your Twitch Client ID]

and save.

Now you can start the development environment:

> yarn start

Once startup completes, you should be able to access it at [http://localhost:3000](http://localhost:3000).