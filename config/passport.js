const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy((usernameToFind, password, done) => {
    // When a user tries to sign-in/login this code runs
    db.User.findOne({
      where: {
        username: usernameToFind
      }
    }).then(dbUser => {
      // If there's no user with the given username
      if (!dbUser) {
        return done(null, false, {
          message: 'Incorrect username.'
        })
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        })
      }
      // If none of the above, return the user without the attached hashed pw
      const userObjectWithoutPassword = {
        username: dbUser.username,
        email: dbUser.email,
        id: dbUser.id
      }
      return done(null, userObjectWithoutPassword)
    })
  })
)

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, done) => {
  // Serialize takes a userObject, and on success calls done with the userId
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // Deserialize takes a userId, and on success returns the userObject. 
  db.User.findOne({
    where: { id }
  })
    .then(userData => {
      const userObjectWithoutPassword = {
        username: userData.username,
        email: userData.email,
        id: userData.id
      }
      return done(null, userObjectWithoutPassword)
    })
    .catch(dbError => {
      return console.log(dbError)
    })
})

// Exporting our configured passport
module.exports = passport
