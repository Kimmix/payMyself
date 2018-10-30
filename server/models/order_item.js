module.exports = (sequelize, DataTypes) => {
  const Order_Item = sequelize.define(
    'Order_Item',
    {
      order_item_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      order_fk: {
        allowNull: false,
        foreignKey: true,
        type: DataTypes.INTEGER
      },
      product_fk: {
        allowNull: false,
        foreignKey: true,
        type: DataTypes.INTEGER
      },
      order_item_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      order_item_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Order_Item.associate = function(models) {
    Order_Item.belongsTo(models.Order, {
      foreignKey: 'order_fk',
      onDelete: 'CASCADE'
    });
    Order_Item.belongsTo(models.Product, {
      foreignKey: 'product_fk',
      onDelete: 'CASCADE'
    });
  };
  return Order_Item;
};
