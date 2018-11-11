module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Products', {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_description: {
        type: Sequelize.STRING
      },
      product_picture_url: {
        type: Sequelize.STRING
      },
      product_price: {
        type: Sequelize.FLOAT
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
    queryInterface.dropTable('Products')
};
