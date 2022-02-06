const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req,res) => {
    const {name , password} = req.body
    if(!name || !password) return res.status(400).json({'message' : '"name" and "password" are required.' })

    const foundUser = await User.findOne({ username: name }).exec();
   
    if(!foundUser) return res.sendStatus(401); // Unauthorized

    // password evaluation
    const match = await bcrypt.compare(password, foundUser.password);

    if(match) {
        const foundRoles = Object.values(foundUser.roles).filter(Boolean);

        // create JWT's
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": foundRoles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        // Saving refreshToken with current user in db
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt' , refreshToken , 
        {
            httpOnly:true,
            sameSite:'None',
            //secure: true, TODO: <--------------- must be true for production
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({accessToken , foundRoles })
        console.log('my roles are:', foundRoles)

    }else {
        res.sendStatus(401); // Unauthorized
    }   
}

module.exports = {handleLogin}