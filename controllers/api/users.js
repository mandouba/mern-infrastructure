const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


module.exports = {
    create,
    login,
    checkToken
}



/*-- Helper Functions --*/

function createJWT(user) {
    return jwt.sign(
      // data payload
      { user },
      process.env.SECRET,
      { expiresIn: '24h' }
    );
  }



async function create(req, res) {
    try {
        // add ther user to the db
        console.log(User)
        const user = await User.create(req.body)
        const token = createJWT(user)
        res.json(token)
    } catch (err) {
        // client will chek for any non 200 code
        console.log(err)
        res.status(400).json(err) 
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) throw new Error()
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new Error()
        res.json(createJWT(user))
    } catch (err) {
        console.log(err)
        res.status(400).json('Bad Credentials')
    }
}

function checkToken(req, res) {
    // req.user will always be there for you when a token is sent
    console.log('req.user', req.user);
    res.json(req.exp);
  }