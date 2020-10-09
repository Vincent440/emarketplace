const router = require('express').Router()
const db = require('../models')
const passport = require('../config/passport')

// delete an item from the cart
router.delete('/api/cart', (req, res) => {
  db.cart_items
    .destroy({
      where: { userId: req.user.id, id: req.body.id }
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
  console.log(req.body)
  db.cart_items
    .findOrCreate({
      where: { userId: req.user.id, productId: req.body.productId },
      defaults: {
        num: parseInt(req.body.num),
        each_price: req.body.each_price,
        UserId: req.user.id,
        productId: req.body.productId
      }
    })
    .then(([cartItem, wasCreated]) => {
      console.log(cartItem)
      console.log(wasCreated)
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
    .catch(error => console.log(error))
})

// route for processing a submitted order / set variables for submitting an order
router.post('/api/cart/submitted', (req, res, next) => {
  // first find the cart that has been submitted
  db.cart_items
    .findAll({
      attributes: ['id', 'num', 'each_price', 'productId'],
      where: { UserId: req.user.id }
    })
    .then(data => {
      // then add the submitted cart to the orders table, then add each of the items from cart_items to the order_items table with the correct orderID
      db.orders
        .create({
          shipping_cost: 0,
          order_total: req.body.order_total,
          UserId: req.user.id
        })
        .then(result => {
          data.forEach(element => {
            db.order_items.create({
              num: element.num,
              each_price: element.each_price,
              orderId: result.id,
              productId: element.productId
            })
          })
          const order = {
            orderId: result.id
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
      where: { userId: req.user.id }
    })
    .then()
})

// update account info
router.put('/api/account', (req, res) => {
  if (req.body.password === '') {
    db.User.update(
      {
        username: req.body.username,
        email: req.body.email
      },
      {
        where: { id: req.user.id }
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
      db.User.update(
        {
          username: req.body.username,
          password: hash,
          email: req.body.email
        },
        {
          where: { id: req.user }
        }
      ).then(data => {
        res.send(data ? 'success' : 'failed').end()
      })
    })
  }
})

// register for an account
router.post('/api/account/register', (req, res) => {
  db.User.findOrCreate({
    where: { username: req.body.username },
    defaults: {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }
  }).then(([userArray, wasCreated]) => {
    if (wasCreated) {
      res.send('success').end()
    } else {
      res.send('taken').end()
    }
  })
})

// login with an existing username and password
router.post(
  '/api/account/login',
  passport.authenticate('local'),
  (req, res) => {
    console.log(req.body)
    res.send('success').end()
  }
)

module.exports = router
