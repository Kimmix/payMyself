module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Articles", {
      article_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
      title: {
        type: Sequelize.STRING
      },
      excerpt: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING(1023)
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
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("Articles")
}
