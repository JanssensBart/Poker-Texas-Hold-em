const Player = require('../Model/Player');
const { v4: uuidv4 } = require('uuid');

const createPlayer = (name , socket) => {

    const newPlayer = new Player(name , socket.id)




}