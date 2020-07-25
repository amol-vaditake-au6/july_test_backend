const User = require("../models/User");

module.exports = {
  async registerUser(req, res) {
    try {
      const user = await User.create({
        ...req.body,
      });
      await user.save();
      res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      res.send(err.message);
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        return res.send({
          error: "Incorrect credentials",
          massage: "fail",
        });
      const user = await User.findByEmailAndPassword(email, password);
      if (!user) {
        res.send({
          error: "invalid Credential",
          massage: "fail",
        });
      } else {
        await user.generateToken();
        res.send(user);
      }
    } catch (err) {
      console.log(err.message);
      res.send({
        error: "invalid Credential",
        massage: "fail",
      });
    }
  },

  async logoutUser(req, res) {
    const token = req.body.token;
    try {
      const user = await User.findOne({
        where: {
          token,
        },
      });
      await user.setDataValue("token", "");
      await user.save();
      res.send({
        massage: "done",
      });
    } catch (err) {
      console.log(err.message);
      res.send({
        error: "invalid Credential",
        massage: "fail",
      });
    }
  },
};
