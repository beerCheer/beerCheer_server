"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Preference, {
        foreignKey: "userId",
      });
      User.hasMany(models.Rate, {
        foreignKey: "userId",
      });
      User.hasMany(models.Favorite, {
        foreignKey: "userId",
      });
      User.hasMany(models.Comment, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      },
      isPreferenceOrRateChecked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      charset: "utf8",
    }
  );
  return User;
};
