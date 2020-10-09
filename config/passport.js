const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')

// Telling passport we want to use a Local Strategy. In other words, we want login with a username and password
passport.use(
  new LocalStrategy((usernameToFind, password, done) => {
    // When a user tries to sign-in/login this code runs
    db.User.findOne({
      where: {
        username: usernameToFind
      }
    })
      .then(dbUser => {
        if (!dbUser) {
          // If there's no user with the given username
          return done(null, false, {
            message: 'Incorrect username.'
          })
        }

        if (!dbUser.validPassword(password)) {
          // If there is a user with the given username, but the password the user gives us is incorrect
          return done(null, false, {
            message: 'Incorrect password.'
          })
        }

        // otherwise return the user without the attached hashed pw
        const { username, email, id } = dbUser
        return done(null, { username, email, id })
      })
      .catch(dbError => console.log(dbError))
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
      // Returning the user object without hashed password
      const { username, email, id } = userData
      return done(null, { username, email, id })
    })
    .catch(dbError => {
      return console.log(dbError)
    })
})

// Exporting our configured passport
module.exports = passport
