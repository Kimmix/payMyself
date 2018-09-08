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
      user_fk: {
        allowNull: false,
        foreignKey: true,
        type: DataTypes.UUID
      },
      order_total: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: "cart_id",
      onDelete: "CASCADE"
    });
    Order.hasMany(models.Cart_Item, {
      foreignKey: "cart_fk"
    });
  };
  return Order;
};
