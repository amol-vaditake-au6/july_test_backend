const { Router } = require("express");
const {
  uploadImage,
  alterFavorites,
  deleteImage,
  changePrivacy,
  userImages,
  allImages,
  getUserFavorites,
} = require("../controller/imageController");
const upload = require("../utils/multer");
const router = Router();

router.post("/upload", upload.array("fileUpload"), uploadImage);
router.post("/fav", alterFavorites);
router.post("/privacy", changePrivacy);
router.post("/delete", deleteImage);
router.post("/userImages", userImages);
router.post("/getUserFavorites", getUserFavorites);
router.get("/allImages", allImages);

module.exports = router;
