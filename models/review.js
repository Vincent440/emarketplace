module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'reviews',
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  )
  Review.associate = models => {
    Review.belongsTo(models.users, {
      foreignKey: { name: 'userId', allowNull: false },
      onDelete: 'cascade'
    })
    Review.belongsTo(models.products, {
      foreignKey: { name: 'productId', allowNull: false },
      onDelete: 'cascade'
    })
  }
  return Review
}
