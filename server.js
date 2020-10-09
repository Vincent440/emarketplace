'use strict'
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const expressHandlebars = require('express-handlebars')
const passport = require('passport')
const SessionStore = require('connect-session-sequelize')(session.Store)
const db = require('./models')
const apiRoutes = require('./controllers/apiRoutes.js')
const htmlRoutes = require('./controllers/htmlRoutes.js')

const PORT = process.env.PORT || 3000
// In `.env` file add `SYNC_DB=true` to drop database tables.
const dbSync = { force: process.env.SYNC_DB || false }
const sequelizeSessionStore = new SessionStore({ db: db.sequelize })
const app = express()

app.engine('handlebars', expressHandlebars({ defaultLayout: 'user' }))

app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(
  session({
    secret: 'the-emarketplace secret',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Make sure to set maxAge, otherwise the browser might delete the cookie on browser exit
      maxAge: 3600000, // 3600000 1 hour in milliseconds. The expiration time of the cookie to set it as a persistent cookie.
      sameSite: true
    }
  })
)
sequelizeSessionStore.sync()

app.use(passport.initialize())
app.use(passport.session())
app.use(apiRoutes)
app.use(htmlRoutes)

db.sequelize
  .sync(dbSync)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`\nServer listening on: http://localhost:${PORT}`)
    )
  })
  .catch(error => {
    console.log(error)
  })
