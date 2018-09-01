module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      cart_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID
      }
    },
    {}
  );
  Cart.associate = function(models) {
    Cart.belongsTo(models.User, {
      foreignKey: "cart_id",
      onDelete: "CASCADE"
    });
    Cart.hasMany(models.Cart_Item, {
      foreignKey: "cart_fk"
    });
  };
  return Cart;
};
