'use strict'
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const SessionStore  = require('connect-session-sequelize')(session.Store)
const db = require('./models')
const apiRoutes = require('./controllers/apiRoutes.js')
const htmlRoutes = require('./controllers/htmlRoutes.js')
const PORT = process.env.PORT || 3000

const app = express()
const sequelizeSessionStore = new SessionStore({
  db: db.sequelize
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(
  session({
    secret: 'the-emarketplace secret',
    store: sequelizeSessionStore,
    resave: false,
    // proxy: true // if you do SSL outside of node.
    saveUninitialized: false,
    cookie: {// Make sure to set maxAge, otherwise the browser might delete the cookie on browser exit
      maxAge: 3600000, // 3600000 1 hour in milliseconds. The expiration time of the cookie to set it as a persistent cookie.
      sameSite: true
    }
  })
)

sequelizeSessionStore.sync()

app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', exphbs({ defaultLayout: 'user' }))
app.set('view engine', 'handlebars')

app.use(apiRoutes)
app.use(htmlRoutes)

db.sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`\nServer listening on: http://localhost:${PORT}`)
    )
  })
  .catch(error => {
    console.log(error)
  })
