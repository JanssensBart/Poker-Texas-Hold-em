const { v4: uuidv4 } = require("uuid");

class Player {
  constructor(name, password, socket) {
    this.id = uuidv4();
    this.name = name;
    this.password = password;
    this.cards = [];
    this.credits = 0;
    this.socket = socket // socket.id
  }
}

module.exports = Player;
