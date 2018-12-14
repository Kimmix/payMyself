module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: {
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
    payment_amount: {
      type: DataTypes.FLOAT
    },
    payment_type: {
      type: DataTypes.ENUM,
      values: ['refill', 'pay']
    }
  });
  // Payment.associate = function(models) {
  //   Payment.belongsToMany(models.User, {
  //     foreignKey: 'user_fk',
  //     onDelete: 'CASCADE'
  //   });
  // };
  return Payment;
};
