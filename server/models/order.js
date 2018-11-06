module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
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
        type: DataTypes.FLOAT
      }
    },
    {}
  );
  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'user_fk',
      onDelete: 'CASCADE'
    });
    Order.hasMany(models.Order_Item, {
      foreignKey: 'order_fk'
    });
  };
  return Order;
};
