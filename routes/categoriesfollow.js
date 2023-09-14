const express = require("express");
const router = express.Router();
const { Categories } = require("../models/categoriesfollow");
const { Category } = require("../models/category");
const multer = require("multer");
const mongoose = require("mongoose");
const {
  getCategories,
  deteleCategories,
  putCategories,
} = require("../controller/categories");

router.get("/", getCategories);

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
// // Vấn đề xảy ra có thể do cách Postman gửi dữ liệu dưới hai hình thức khác nhau. Khi bạn sử dụng "raw json", dữ liệu được gửi dưới dạng JSON và server có thể đọc trực tiếp thông qua req.body. Tuy nhiên, khi bạn sử dụng "form-data", dữ liệu được gửi dưới dạng multipart/form-data, và để đọc dữ liệu này trong Express, bạn cần sử dụng một middleware như multer để xử lý.
// You sent
// Sử dụng upload.none() cho phép bạn xử lý các dữ liệu không có tệp đính kèm từ form-data. Dữ liệu sẽ được lưu vào req.body giống như khi bạn sử dụng "raw json". Bây giờ, bạn nên thử lại gửi yêu cầu từ Postman bằng form-data và kiểm tra xem liệu bạn có thể nhận được dữ liệu đúng từ req.body hay không.
// You sent
// const multer = require('multer');
// const upload = multer();
// You sent
// const postCategories = async (req, res) => {
//   // ...
// };

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  console.log(req.body);
  const categories = await Category.findById(req.body.categories);
  if (!categories) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("Invalid File");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Categories({
    name: req.body.name,

    image: `${basePath}${fileName}`,

    categories: req.body.categories,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});
router.delete("/:id", deteleCategories);
// router.put("/:id", putCategories);
module.exports = router;
