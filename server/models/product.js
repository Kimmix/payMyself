module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      product_name: DataTypes.STRING,
      product_description: DataTypes.STRING,
      product_picture_url: DataTypes.STRING,
      product_price: DataTypes.FLOAT
    },
    {}
  );
  Product.associate = models => {
    Product.hasMany(models.Cart_Item, {
      foreignKey: 'product_fk'
    });
  };
  return Product;
};
