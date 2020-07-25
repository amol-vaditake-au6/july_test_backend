const Image = require("../models/Image");
const Favorites = require("../models/Favorites");
const User = require("../models/User");
const convertBufferToString = require("../utils/convertBufferToString");
const cloudinary = require("../utils/cloudinary");
const { Sequelize } = require("sequelize");
const fs = require("fs");

module.exports = {
  async userImages(req, res) {
    try {
      const userId = req.body.userId;
      const images = await Image.findAll({
        where: {
          userId,
        },
      });
      res.status(200).json(images);
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },
  async getUserFavorites(req, res) {
    try {
      const userId = req.body.userId;
      const images = await Favorites.findAll({
        where: {
          userId,
          favorites: true,
        },
      });
      data = [];
      for (i = 0; i < images.length; i++) {
        const get = await Image.findOne({
          where: {
            id: images[i].imageId,
          },
        });
        data.push(get);
      }
      res.send(data);
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },
  async allImages(req, res) {
    try {
      const images = await Image.findAll({
        where: {
          privacy: "public",
        },
      });
      res.status(200).json(images);
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },
  async uploadImage(req, res) {
    console.log(req.body);
    const uploader = async (path) => await cloudinary.uploads(path, "Images");
    console.log(uploader);
    try {
      id = req.body.id;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      const userName = user.name;
      const uploader = async (path) => await cloudinary.uploads(path, "Images");
      if (req.method === "POST") {
        const urls = [];
        data = [];
        const files = req.files;
        for (const file of files) {
          const imageContent = convertBufferToString(
            file.originalname,
            file.buffer
          );
          const newPath = await uploader(imageContent);
          urls.push(newPath.url);
          const image = await Image.create({
            userId: req.body.id,
            privacy: req.body.privacy,
            imgURL: newPath.url,
            userName,
          });
          data.push(image);
        }
        for (let i = 0; i++; i < urls.length) {
          const image = await Image.create({
            userId: req.body.id,
            privacy: req.body.privacy,
            imgURL: urls[i],
          });
          data.push(image);
        }
        res.status(200).json({
          message: "images uploaded successfully",
          data,
          urls,
        });
      }
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },

  async alterFavorites(req, res) {
    try {
      const userId = req.body.userId;
      const imageId = req.body.imageId;
      const image = await Favorites.findOne({
        where: {
          userId,
          imageId,
        },
      });
      if (!image) {
        const fav = await Favorites.create({
          userId,
          imageId,
          favorites: true,
        });
        res.status(200).json({
          fav,
          massage: "added",
        });
      } else {
        await image.update({
          favorites: !image.favorites,
        });
        if (image.favorites === false) {
          res.status(200).json({
            image,
            massage: "removed",
          });
        }
        if (image.favorites === true) {
          res.status(200).json({
            image,
            massage: "added",
          });
        }
      }
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },

  async deleteImage(req, res) {
    try {
      const id = req.body.id;
      const imageId = req.body.imageId;
      await Image.destroy({
        where: {
          id: imageId,
          userId: id,
        },
      });
      res.status(200).json({
        massage: "done",
      });
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },

  async changePrivacy(req, res) {
    try {
      const id = req.body.id;
      const imageId = req.body.imageId;
      const image = await Image.findOne({
        where: {
          id: imageId,
          userId: id,
        },
      });
      if (image.privacy === "public") {
        await image.update({ privacy: "private" });
      } else {
        await image.update({ privacy: "public" });
      }
      res.status(200).json({
        image,
        massage: "done",
      });
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },
};
