const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { json } = require("express");

//db
mongoose.connect(
  "mongodb+srv://Bart:eXprt130483@poker.k4s6n.mongodb.net/Poker?retryWrites=true&w=majority",
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//Schemas
const Users = require("./src/Schemas/UserSchema");

// MODALS
const Casino = require("./src/Model/Casino/Casino");
const Table = require("./src/Model/Table/Table");


// SERVER SETUP
app.use(bodyParser.json());
app.use(cors());
//serve simple homepage for server
app.use(router);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    //origin: client that will call to our server
    origin: "http://localhost:3000",

    //specify what methodes are allowed
    methodes: ["GET", "POST"],
  },
});

//  GAME LOGIC \\
const CasinoName = "Cobalt Poker";
const MyCasino = new Casino(CasinoName);

//  RANDOM TABLES

const randomTables = [
  {
    tableName: "Default table 1",
    playerLimit: 9,
    maxCredits: 2000,
    blinds: {
      smallBlind: 10,
      bigBlind: 20,
    },
  },
  {
    tableName: "Default table 2",
    playerLimit: 9,
    maxCredits: 2000,
    blinds: {
      smallBlind: 10,
      bigBlind: 20,
    },
  },
  {
    tableName: "Default table 3",
    playerLimit: 9,
    maxCredits: 2000,
    blinds: {
      smallBlind: 10,
      bigBlind: 20,
    },
  },
];

createRandomTables = randomTables.map((randomTable) =>
  MyCasino.CreateNewTable(randomTable)
);
createRandomTables.map((table) => MyCasino.addTableToCasino(table));

io.on("connection", (socket) => {
  //console.log(`new WS ${socket.id}`)
  io.emit("Casino_name", CasinoName);
  io.emit("casino_GET_allPlayers", { data: MyCasino.ReturnPlayers() });
  io.emit("casino_GET_allTables", { data: MyCasino.ReturnTables() });

  
  socket.on("register_new_player", async (payload) => {
    const { name, password } = payload.data;
    console.log( name,password)

    if(!name || !password) throw Error('Fill in all credentials pls')

    try{
      const user = await Users.findOne({ name });
      if (user) throw Error('Username is allready taken!');

      const newUser = new Users({
        name : name,
        password : password,
        wallet : 0
      })

      const savedUser = await newUser.save();
      console.log(savedUser)
      if(!savedUser) throw Error('Something went wrong saving the user, try again')

      io.to(socket.id).emit('urProfile' , {data : savedUser})
    
      } catch (e) {
        console.log(e);
        socket.emit("signup_error",  json(e.message));
        
      }
 

  });
  
  socket.on("login_player", async (payload) => {
    const { name, password } = payload.data;


    if(!name || !password) throw Error('Fill in all credentials pls')

    try {
      const user = Users.findOne({name: name , password: password} , function (req ,res) { 

        if(!res) socket.emit("login_error", 'Wrong credentials')

        const loginPlayer = {
          id: res._id.toString(),
          name : res.name,
          wallet: res.wallet
        }
        //console.log(loginPlayer)
        io.to(socket.id).emit("Casino_player_profile" , {data : loginPlayer})
        MyCasino.addPlayerToCasino(loginPlayer)
      })
    
    } catch (e) {
      console.log(e);
      
    }
    

  });


  socket.on("join_chat", (data) => {
    const { room, socketID } = data;

    try {
      if (socketID) {
        socket.join(room);
        let user = MyCasino.findPlayerBySocket(socketID);
        console.log(`${user.name} has joined chat room: ${room}`);

        const welcomeMSG = {
          author: "SERVER",
          message: `${user.name} has joined the chat room`,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        socket.broadcast.emit("recieve_message", welcomeMSG);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("recieve_message", data);
  });

  socket.on("createTable", async (data) => {
    try {
      // create&add table to Casino.tables = []
      const newTable = await MyCasino.CreateNewTable(data);
      await MyCasino.addTableToCasino(newTable);
      io.emit("new_table", { data: newTable });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("join_Table", async (payload) => {
    const { id, socket } = payload;
    try {
      // join right chat

      const joinedTable = MyCasino.joinTableByID(id, socket);
      console.log("table ID:", id);
      console.log("room:", id);
      console.log("socket ID:", socket);

      io.to(id).emit("table_Stats", { data: joinedTable });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    const findIndex = MyCasino.ReturnPlayers().findIndex(
      (player) => player.socketID === socket.id
    );

    try {
      if (findIndex > -1) {
        // log
        const leaver = MyCasino.players[findIndex];
        const obj = {
          name: leaver.name,
          id: leaver.id,
        };
        console.log(obj, ", has left");

        const leaveMSG = {
          author: "SERVER",
          message: `${leaver.name} has left the casino`,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        socket.broadcast.emit("recieve_message", leaveMSG);


        // delete from casino
        MyCasino.players.splice(findIndex, 1);
      }
    } catch (error) {
      console.log("disconnect", error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
