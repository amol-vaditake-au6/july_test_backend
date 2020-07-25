const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");
const User = require("../models/User");
const Image = require("./Image");

const favSchema = {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  imageId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: "id",
    },
  },
  favorites: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
};

class Favorites extends Model {}
Favorites.init(favSchema, {
  sequelize,
  tableName: "favoritess",
});
module.exports = Favorites;
