module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Carts", {
      cart_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "user_id",
          as: "cart_id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Carts")
};
