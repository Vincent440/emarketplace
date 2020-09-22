module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
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
    },
    {
      freezeTableName: true
    }
  )
  User.associate = models => {
    User.hasMany(models.orders, {
      onDelete: 'cascade'
    })
    User.hasMany(models.reviews, {
      foreignKey: { name: 'userId', allowNull: false },
      onDelete: 'cascade'
    })
    User.hasMany(models.cart_items, {
      foreignKey: { name: 'userId', allowNull: false },
      onDelete: 'cascade'
    })
  }
  return User
}
