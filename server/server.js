require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const credentials = require('./config/credentials')
const verifyJWT = require('./middleware/verifyJWT')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnection')
const PORT = process.env.PORT || 5000;


//connect to MongoDB
connectDB();
// Handle options credentials check,
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form-data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

// serve a simple homepage over http
app.get('/', function(req, res){
  res.send('<h1>'+`Server running on port ${PORT}`+'</h1>');
});

//Routes
app.use('/register' , require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/logout' , require('./routes/logout'))
app.use('/refresh', require('./routes/refresh'))

app.use(verifyJWT) // Protected routes, jwt token is needed
app.use('/users', require('./routes/api/users'))





mongoose.connection.once('open' , ()=> {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
