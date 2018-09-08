module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Orders", {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_fk: {
        type: Sequelize.UUID,
        foreignKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "user_id",
          as: "user_fk"
        }
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
