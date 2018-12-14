module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_isAdmin: {
        type: Sequelize.BOOLEAN
      },
      user_name: {
        type: Sequelize.STRING
      },
      user_sex: {
        type: Sequelize.ENUM,
        values: ['male', 'female']
      },
      user_tel: {
        type: Sequelize.STRING
      },
      user_money: {
        type: Sequelize.FLOAT(6)
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
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Users')
};
