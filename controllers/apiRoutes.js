const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const db = require('../models')
const saltRounds = 10

// delete an item from the cart
router.delete('/api/cart', (req, res) => {
  db.cart_items
    .destroy({
      where: { userId: req.user, id: req.body.id }
    })
    .then(data => {
      if (data.id) {
        res.send('success').end()
      } else {
        res.send('error').end()
      }
    })
})

// update the quantity of an item in the cart
router.put('/api/cart', (req, res) => {
  db.cart_items
    .update(
      {
        num: req.body.num
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(data => {
      if (data) {
        res.send('success').end()
      } else {
        res.send('error').end()
      }
    })
})

// add an item to the cart
router.post('/api/cart', (req, res) => {
  db.cart_items
    .findOrCreate({
      where: { userId: req.user, productId: req.body.productId },
      defaults: {
        num: parseInt(req.body.num),
        each_price: req.body.each_price,
        userId: req.user,
        productId: req.body.productId
      }
    })
    .then(([cartItem, wasCreated]) => {
      if (wasCreated) {
        res.send('created').end()
      } else {
        // update the quantity since the item already existed
        db.cart_items
          .update(
            {
              num: parseInt(cartItem.num) + parseInt(req.body.num)
            },
            {
              where: { id: cartItem.id }
            }
          )
          .then(data => {
            if (data) {
              res.send('updated').end()
            } else {
              res.send('error').end()
            }
          })
      }
    })
})

// route for processing a submitted order / set variables for submitting an order
let orderId = 0
let userId = 0
// first find the cart that has been submitted
router.post('/api/cart/submitted', (req, res, next) => {
  userId = req.user
  db.cart_items
    .findAll({
      attributes: ['id', 'num', 'each_price', 'productId'],
      where: { userId: userId }
    })
    .then(data => {
      // then add the submitted cart to the orders table, then add each of the items from cart_items to the order_items table with the correct orderID
      db.orders
        .create({
          shipping_cost: 0,
          order_total: req.body.order_total,
          userId: userId
        })
        .then(result => {
          orderId = result.id
          data.forEach(element => {
            db.order_items.create({
              num: element.num,
              each_price: element.each_price,
              orderId: orderId,
              productId: element.productId
            })
          })
          const order = {
            orderId: orderId
          }
          res.send(order)
        })
    })
  next()
})
// next, delete the cart_items of the cartId that was submitted
router.post('/api/cart/submitted', (req, res) => {
  db.cart_items
    .destroy({
      where: { userId: userId }
    })
    .then()
})

// update account info
router.put('/api/account', (req, res) => {
  if (req.body.password === '') {
    db.users
      .update(
        {
          username: req.body.username,
          email: req.body.email
        },
        {
          where: { id: req.user }
        }
      )
      .then(data => {
        if (data) {
          res.send('success').end()
        } else {
          res.send('failed').end()
        }
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
        res.send('duplicate').end()
      })
  } else {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err)
      }
      db.users
        .update(
          {
            username: req.body.username,
            password: hash,
            email: req.body.email
          },
          {
            where: { id: req.user }
          }
        )
        .then(data => {
          res.send(data ? 'success' : 'failed').end()
        })
    })
  }
})

// register for an account
router.post('/api/account/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err)
    }
    db.users
      .findOrCreate({
        where: { username: req.body.username },
        defaults: {
          username: req.body.username,
          password: hash,
          email: req.body.email
        }
      })
      .then(([userArray, wasCreated]) => {
        if (wasCreated) {
          res.send('success').end()
        } else {
          res.send('taken').end()
        }
      })
  })
})

// login with an existing username and password
let pwd = ''
router.post('/api/account/login', (req, res) => {
  pwd = req.body.password
  db.users
    .findOne({
      attributes: ['id', 'username', 'password'],
      where: {
        username: req.body.username
      }
    })
    .then(data => {
      if (data) {
        bcrypt.compare(pwd, data.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            userId = data.id
            req.login(userId, err => {
              if (err) throw err
              // console.log('\nUser is being logged in!\n')
              res.send('success').end()
            })
          } else {
            // console.log('\nPassword not valid!\n')
            res.send('Password not valid!').end()
          }
        })
      } else {
        // console.log('\nNo match found for the submitted username!\n')
        res.send('Username not found!').end()
      }
    })
})

passport.serializeUser((userId, done) => {
  done(null, userId)
})

passport.deserializeUser((userId, done) => {
  done(null, userId)
})

module.exports = router
