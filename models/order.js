module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'orders',
    {
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      order_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  )
  Order.associate = models => {
    Order.belongsTo(models.users, {
      foreignKey: { name: 'userId', allowNull: false },
      onDelete: 'cascade'
    })
    Order.hasMany(models.order_items, {
      foreignKey: { name: 'orderId', allowNull: false },
      onDelete: 'cascade'
    })
  }
  return Order
}
