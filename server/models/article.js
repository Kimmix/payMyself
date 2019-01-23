module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Article", {
    article_id: {
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
    title: {
      type: DataTypes.STRING
    },
    excerpt: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    }
  })

  return Payment
}
