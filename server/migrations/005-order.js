module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Orders", {
      order_id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      cart_fk: {
        type: Sequelize.UUID,
        foreignKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Carts",
          key: "cart_id",
          as: "cart_fk"
        }
      },
      product_fk: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Products",
          key: "product_id",
          as: "product_fk"
        }
      },
      order_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      order_total: {
        type: Sequelize.INTEGER
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
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Orders")
};
