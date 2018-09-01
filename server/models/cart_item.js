module.exports = (sequelize, DataTypes) => {
  const Cart_Item = sequelize.define(
    "Cart_Item",
    {
      cart_item_id: {
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
      cart_item_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {}
  );
  Cart_Item.associate = function(models) {
    Cart_Item.belongsTo(models.Cart, {
      foreignKey: "cart_fk",
      onDelete: "CASCADE"
    });
    Cart_Item.belongsTo(models.Product, {
      foreignKey: "product_fk",
      onDelete: "CASCADE"
    });
  };
  return Cart_Item;
};
