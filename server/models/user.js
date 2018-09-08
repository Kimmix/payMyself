const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Email is not valid"
        }
      },
      unique: {
        msg: "This email is already taken."
      }
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user_name: { type: DataTypes.STRING },
    user_sex: { type: DataTypes.ENUM, values: ["male", "female"] },
    user_tel: { type: DataTypes.STRING }
  });

  User.associate = models => {
    User.hasOne(models.Cart, {
      foreignKey: "cart_id"
    });
  };

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.user_password, 10).then(hash => {
      user.user_password = hash;
    });
  });

  User.prototype.generateJWT = function generateJWT() {
    return jwt.sign(
      {
        user_id: this.user_id,
        user_isAdmin: this.user_isAdmin
      },
      process.env.JWT_SECRET
    );
  };

  User.prototype.toAuthJSON = function toAuthJSON() {
    return {
      user_email: this.email,
      user_isAdmin: this.user_isAdmin,
      token: this.generateJWT()
    };
  };

  return User;
};
