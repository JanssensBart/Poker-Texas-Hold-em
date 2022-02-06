const { v4: uuidv4 } = require('uuid');

class Table {
    
  constructor(name,limit,maxCredits,blinds) {

        this.name = name                  // name of the table
        this.id = uuidv4();               // tableiD = id from player who created this table
        this.players = [];                // List of players
        this.maxCredits = maxCredits;     // Starting credit at the start of a new game
        this.blinds = blinds              // {smallBind,bigBlind} set by client
        this.gameStarted = false;         // check if there is a ongoing game
        this.currentRound = null;         // holds currentRound
        this.playerLimit = limit;         // player limit set by client
        this.highestHand = 'high card';   // holds highest hand
        this.previousStarter = 0;         // start on next player every new round
      }

      getTableName() {
        return this.name
      }
      setTableName(name) {
        return this.name = name
      }
      getTableID() {
        return this.id
      }
      setTableId(id) {
        return this.id = id
      }
      getBlinds(){
        return this.blinds
      }
      setBlinds(blinds){
        return this.blinds = blinds
      }
      getPlayers(){
        return this.players
      }

      startGame() {
        return console.log('the game has started')
      }

}

module.exports = Table;