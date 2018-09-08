module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      order_id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
      },
      cart_fk: {
        allowNull: false,
        foreignKey: true,
        type: DataTypes.UUID
      },
      product_fk: {
        allowNull: false,
        foreignKey: true,
        type: DataTypes.INTEGER
      },
      order_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      order_total: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Order.associate = function(models) {
    Order.belongsTo(models.Cart, {
      foreignKey: "cart_fk",
      onDelete: "CASCADE"
    });
    Order.belongsTo(models.Product, {
      foreignKey: "product_fk",
      onDelete: "CASCADE"
    });
  };
  return Order;
};
