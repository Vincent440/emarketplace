const router = require('express').Router()
const Sequelize = require('sequelize')
const op = Sequelize.Op

const db = require('../models')

// find out if the user is logged in
router.get('/user/status', (req, res) => {
  res.send({ user: req.isAuthenticated() })
})

// find all categories for the navbar dropdown
router.get('/category/list', (req, res) => {
  db.categories
    .findAll({
      attributes: ['id', 'name', 'description'],
      order: [['id', 'ASC']]
    })
    .then(categoryList => {
      res.send({ categoryList })
    })
})

// find all the current user's cart info for the navbar
router.get('/cart/info', (req, res) => {
  if (req.isAuthenticated()) {
    db.cart_items
      .findAll({
        attributes: ['id', 'num', 'each_price', 'productId'],
        where: { userId: req.user }
      })
      .then(cart => {
        const cartInfo = {}
        let totalCost = 0
        let uniqueItems = 0
        let totalItems = 0
        cart.forEach(element => {
          totalCost += element.num * element.each_price
          uniqueItems++
          totalItems += element.num
        })
        cartInfo.totalCost = totalCost.toFixed('2')
        cartInfo.uniqueItems = uniqueItems
        cartInfo.totalItems = totalItems
        res.send({ cartInfo })
      })
  } else {
    res.send({})
  }
})

// find all categories to render on the homepage
router.get('/', (req, res) => {
  db.categories
    .findAll({
      attributes: ['id', 'name', 'description', 'image_name'],
      order: [['id', 'ASC']]
    })
    .then(category => {
      if (req.isAuthenticated()) {
        res.render('categories', { category })
      } else {
        res.render('categories', { layout: 'guest', category })
      }
    })
})

// find all products in a specific category
router.get('/category/:id', (req, res) => {
  db.products
    .findAll({
      attributes: ['id', 'name', 'description', 'image_name', 'price'],
      where: { categoryId: req.params.id },
      order: [['id', 'ASC']]
    })
    .then(categoryitems => {
      if (req.isAuthenticated()) {
        res.render('category_items', { categoryitems })
      } else {
        res.render('guest_category_items', { layout: 'guest', categoryitems })
      }
    })
})

// search for products with the search criteria in the name or description
router.get('/search/:criteria', (req, res) => {
  db.products
    .findAll({
      attributes: ['id', 'name', 'description', 'image_name', 'price'],
      where: {
        [op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
            [op.like]: '%' + req.params.criteria + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('description')), {
            [op.like]: '%' + req.params.criteria + '%'
          })
        ]
      },
      order: [['id', 'ASC']]
    })
    .then(categoryitems => {
      if (req.isAuthenticated()) {
        res.render('category_items', { categoryitems })
      } else {
        res.render('guest_category_items', { layout: 'guest', categoryitems })
      }
    })
})

// passport's logout function
router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy(err => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
})

// login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('login', { layout: 'guest' })
  }
})

// register page
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/account')
  } else {
    res.render('register', { layout: 'guest' })
  }
})

// user account page
router.get('/account', (req, res) => {
  if (req.isAuthenticated()) {
    db.users
      .findOne({
        attributes: ['id', 'username', 'email'],
        where: {
          id: req.user
        }
      })
      .then(account => {
        res.render('account', { account })
      })
  } else {
    res.redirect('/login')
  }
})

// find all of a user's orders
router.get('/account/orders', (req, res) => {
  if (req.isAuthenticated()) {
    db.orders
      .findAll({
        attributes: ['id', 'order_total', 'createdAt'],
        where: { userId: req.user },
        order: [['id', 'ASC']]
      })
      .then(orderHistory => res.render('order_history', { orderHistory }))
  } else {
    res.redirect('/login')
  }
})

// find a specific order
router.get('/account/orders/:id', (req, res) => {
  if (req.isAuthenticated()) {
    db.orders
      .findOne({
        attributes: ['id', 'order_total', 'createdAt'],
        where: { id: req.params.id, userId: req.user },
        include: [
          {
            model: db.order_items,
            attributes: ['num', 'each_price'],
            include: [
              { model: db.products, attributes: ['name', 'description'] }
            ]
          }
        ]
      })
      .then(order => {
        res.render('order_details', { order })
      })
  } else {
    res.redirect('/login')
  }
})

// find all the current user's cart items and info
router.get('/cart', (req, res) => {
  if (req.isAuthenticated()) {
    db.cart_items
      .findAll({
        attributes: ['id', 'num', 'each_price', 'productId'],
        where: { userId: req.user },
        order: [['id', 'ASC']],
        include: [{ model: db.products, attributes: ['name', 'description'] }]
      })
      .then(data => {
        let totalCost = 0
        let totalItems = 0
        const cart = []
        for (let i = 0; i < data.length; i++) {
          const tempObj = {}
          totalItems += data[i].num
          totalCost += data[i].num * data[i].each_price
          tempObj.id = data[i].id
          tempObj.num = data[i].num
          tempObj.each_price = data[i].each_price
          tempObj.total_price = (data[i].num * data[i].each_price).toFixed(2)
          tempObj.productId = data[i].productId
          tempObj.product = data[i].product
          cart.push(tempObj)
        }
        totalCost = totalCost.toFixed(2)
        res.render('checkout', {
          cart,
          cart_total: totalCost,
          total_items: totalItems
        })
      })
  } else {
    res.redirect('/login')
  }
})

// catch all for undefined routes that goes to our 404 error page
router.get('*', (req, res) => {
  res.render('error')
})

module.exports = router
