const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  User.associate = models => {
    User.hasMany(models.orders, {
      onDelete: 'cascade'
    })
    User.hasMany(models.cart_items, {
      foreignKey: { name: 'UserId', allowNull: false },
      onDelete: 'cascade'
    })
  }
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (passwordToCheck) {
    return bcrypt.compareSync(passwordToCheck, this.password)
  }
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook('beforeCreate', user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
  })

  return User
}
