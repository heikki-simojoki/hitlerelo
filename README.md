# hitlerelo
Server and client for tracking [Secret Hitler](https://www.secrethitler.com/) games using Elo rating.

Working instance is hosted on https://tefy.net



## Server

The API server is a simple two-script NodeJS program, where server.js has an express server running a basic REST api. Elo.js handles all of the actual logic, houses
the current data about games and players, and saves this data to disk when it is modified. 

The ranking algorithm itself runs the normal [Elo algorithm](https://en.wikipedia.org/wiki/Elo_rating_system)
using average ratings of the two teams. K-factor is set to 20 times the player amount. The gained/lost elo points are distributed according to the players' elo, in such a way that
low-ranked players lose least/gain most and high-rated players lose most/gain least.

The API can be used to request/modify two types of data: Games and Players. Player object contaisn their name, ID, current rating and details about game history.
Players can be modified only trough adding/removing games. Games contain details about a single
game the players in it. Each game has a list of Player objects at the time the game was played. This can be used to build a history of a players rank.

There is currenty no JSON validation on the server side.

#### Player:
```
{
  name: String,
  id: String,
  elo: Number,
  liberalGames: Number,
  facistGames: Number,
  totalGames: Number, 
  liberalWins: Number,
  facistWins: Number,
  totalWins: Number,
  hitlerGames: Number,
  hitlerWins: Number,
  shotAsLiberal: Number,
  shotAsFacist: Number,
  shotAsHitler: Number,
  timesShot: Number
}
```

#### Game:
```
{
  time: Unix timestamp,
  facistsWon: Boolean,
  facists: Array,
  liberals: Array,
  hitler: Object,
  shot: Array,
}
```
All participating players are represented in either facists or liberals, and duplicate objects are in hitler and shot if applicable. These Objects are as follows:

#### Player (in Game):
```
{
  name: String,
  id: String,
  elo: Number,
  eloChange: Number,
}
```
Where eloChange is how much the player's rating changed this game.

When adding a game, the above Game object should be passed as a body of the post  request, with the time field omitted and player objects replaced with just their IDs.
When adding a player, the body of the post request should be a JSON object containg only the field ´´´name´´´.
## Client

The client is a Vue.js app, which is divided into five main sections: `Add Game`, `Add Player`, `Games`, `Players` and `Player` The client has
little in the ways of protection agaist abuse, so please be respectful if you decide to take a gander.
