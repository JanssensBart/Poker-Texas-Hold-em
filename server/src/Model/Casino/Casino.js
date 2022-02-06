const Table = require('../Table/Table');
const Player = require('../Player/Player');

class Casino {
    constructor(casinoName) {
        this.casinoName = casinoName;
        this.players = [];
        this.tables = [];
    }

    
    LogAllTables() {
        return console.log('Server - this.tables:',this.tables)
    }
    LogAllPlayers() {
        return console.log('Server - this.players:',this.players)
    }

    ReturnTables() {
        return this.tables
    }
    ReturnPlayers() {
        return this.players
    }

    createNewPlayer(name, password, socket){
        const newPlayer = new Player(name, password, socket.id)
        
        return newPlayer
    }

    addPlayerToCasino(newPlayer){

        try {
            if(this.players.find( player => player.id === newPlayer.id)) throw 'Allready in casino';

                this.players.push(newPlayer)
                 return console.log(
            'Added player to Casino:', 
                {
                    name: newPlayer.name ,
                    id: newPlayer.id,
                })
        }
        catch (error) {
            console.log(error)
        } 
    }

    CreateNewTable(table){
        const newTable = new Table(table.tableName,table.playerLimit,table.maxCredits,table.blinds)

        return newTable
    }
    addTableToCasino(table){
        
        this.tables.push(table)
    
        return console.log(
            'Added table to Casino:', 
                {
                    name: table.name ,
                    id: table.id
                }
            )
    
    }

    findTableByID(id){  
        return  this.tables.find(table => table.id === id)
    }

    findPlayerBySocket(id){
        return this.players.find(player => player.socketID === id)
    }

    addPlayerToTable(thisTable,player){
        const mytable = thisTable.players.push(player)
        return mytable
    }

    joinTableByID(id,socket){
        const table = this.findTableByID(id)
        const player = this.findPlayerBySocket(socket)
        this.addPlayerToTable(table,player)
        
        return table  
    }


   
}



module.exports = Casino;