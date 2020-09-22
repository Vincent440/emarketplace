module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'categories',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  )
  Category.associate = models => {
    Category.hasMany(models.products, {
      foreignKey: { name: 'categoryId', allowNull: false },
      onDelete: 'cascade'
    })
  }
  return Category
}
