const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { check, validationResult } = require('express-validator');

const riddleDao = require('./dao-riddles'); 
const userDao = require('./dao-users'); 

/** Authentication-related imports **/
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');


/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

// Set up local strategy to verify, search in the DB a user with a matching password, and retrieve its information by userDao.getUser (i.e., id, username, name).
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return cb(null, false, 'Incorrect username or password');  
    
  return cb(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, cb) { // this user is id + username + name 
  cb(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, cb) { // this user is id + email + name 
  return cb(null, user); // this will be available in req.user
});

// Creating the session
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/*** Defining authentication verification middleware ***/

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user); // WARN: returns 200 even if .status(200) is missing?
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


/*** Riddles APIs ***/

// GET /api/riddles
// This route returns the Riddle Library.
app.get('/api/riddles', 
(req, res) => {
  riddleDao.getRiddles()
    .then(async riddles => {
      for(i=0;i<riddles.length;i++){
        const replies = await riddleDao.getResponsesByRiddleId(riddles[i].riddleId)
        riddles[i].replies= replies;
      }
        res.json(riddles)
    })
    .catch((err) => res.status(500).json(err));
});
// This route gets al the players (used for ranking)
app.get('/api/players', 
(req, res) => {
  riddleDao.getPlayers()
    .then(async players => {
        res.json(players)
    })
    .catch((err) => res.status(500).json(err));
});

// This route adds a riddle
app.post('/api/riddles/',
isLoggedIn,
[
  check('text').isString(),
  check('difficulty').exists(),
  check('maxDuration').isInt({min:30, max:600}),
  check('answer').isString(),
  check('hint1').isString(),
  check('hint2').isString(),  
],
async (req,res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if(!errors.isEmpty()){
    return res.status(422).json({error: errors.array().join(", ")})
  } 
  const riddle = {
    text: req.body.text,
    difficulty: req.body.difficulty,
    maxDuration: req.body.maxDuration,
    answer: req.body.answer,
    hint1: req.body.hint1,
    hint2: req.body.hint2,
    isClosed: req.body.isClosed,
    author: req.body.author 
  }

  try{
    const result = await riddleDao.createRiddle(riddle);
    res.json(result);
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of new film: ${err}` })
  }
})

// This route closes the riddle for all players
app.put('/api/riddles/:riddleId/close',
isLoggedIn,
[ check(['riddleId']).isInt() ],
async (req, res) => {
  try{
    const riddle = await riddleDao.getRiddleById(req.params.riddleId);
    const result = await riddleDao.closeRiddle(riddle.riddleId)
    return res.json(result)
  }catch(err){
    res.status(503).json({error: `DB error during updating the riddle with riddleId: ${req.params.riddleId}`})
  }
})

// This route updates the reply array of a riddle by adding another reply
app.put('/api/riddles/:riddleId/addReply',
isLoggedIn,
[ check(['riddleId']).isInt() ],
async (req, res) => {
  try{
    const result = await riddleDao.addReply({riddleId:req.body.riddleId,author:req.user.id,reply:req.body.reply})
    return res.json(result)
  }catch(err){
    res.status(503).json({error: `DB error during updating the riddle with riddleId: ${req.params.riddleId}`})
  }
})

// This route updates the score
app.put('/api/players/:id/updateScore',
isLoggedIn,
[ check(['id']).isInt() ],
async (req, res) => {
  try{
    const result = await riddleDao.updateScore({id:req.body.id,score:req.body.score})
    return res.json(result)
  }catch(err){
    res.status(503).json({error: `DB error during updating the riddle with riddleId: ${req.params.riddleId}`})
  }
})

// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
