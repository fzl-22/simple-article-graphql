const path = require("path");
const fs = require("fs");

const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/images");
  },
  filename: (req, file, cb) => {
    const now = new Date().toISOString();
    cb(null, `${now}-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });

const deleteImage = (filePath) => {
  filePath = path.join(__dirname, "..", "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = { uploadImage: uploadImage, deleteImage: deleteImage };
