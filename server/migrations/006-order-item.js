module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Order_Items', {
      order_item_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_fk: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Orders',
          key: 'order_id',
          as: 'order_fk'
        }
      },
      product_fk: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Products',
          key: 'product_id',
          as: 'product_fk'
        }
      },
      order_item_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      order_item_qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable('Order_Items')
};
