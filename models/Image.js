const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");
const User = require("../models/User");

const imageSchema = {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imgURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  privacy: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  favorites: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
};

class Image extends Model {}
Image.init(imageSchema, {
  sequelize,
  tableName: "images",
});
module.exports = Image;
