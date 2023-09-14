const { Category } = require("../models/category");
const { Categories } = require("../models/categoriesfollow");
const express = require("express");
const mongoose = require("mongoose");
const getCategory = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
};

// const postCategories = async (req, res) => {
//   console.log(req.body);
//   const categories = await Category.findById(req.body.categories);
//   if (!categories) return res.status(400).send("Invalid Category");

//   let product = new Categories({
//     name: req.body.name,
//     icon: req.body.icon || categories.icon,
//     color: req.body.color,
//     categories: req.body.categories,
//   });

//   product = await product.save();

//   if (!product) return res.status(500).send("The product cannot be created");

//   res.send(product);
// };

const getCategories = async (req, res) => {
  // localhost:3000/api/v1/product?categories=2342342,234234
  console.log(req.query.categories);
  let filter = {};
  if (req.query.categories) {
    filter = { categories: req.query.categories.split(",") };
  }
  const productList = await Categories.find(filter).populate("categories");

  if (!productList) {
    res.status(500).json({ success: fasle });
  }
  res.send(productList);
};

const deteleCategories = async (req, res) => {
  Categories.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

// const putCategories = async (req, res) => {
//   if (!mongoose.isValidObjectId(req.params.id)) {
//     return res.status(400).send("Invaild Product Id");
//   }

//   const category = await Category.findById(req.body.categories);
//   if (!category) return res.status(400).send("Invalid Category");
//   console.log(req.params.id);
//   const product = await Categories.findById(req.params.id);
//   if (!product) return res.status(400).send("Invalid Product");
//   const updatedProduct = await Categories.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       category: req.body.category,
//     },
//     { new: true }
//   );

//   if (!updatedProduct)
//     return res.status(400).send("the category cannot be created");

//   res.send(updatedProduct);
// };

module.exports = {
  getCategory,

  getCategories,
  deteleCategories,
  // putCategories,
};
