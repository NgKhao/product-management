const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String, //San Pham 1
    product_category_id: {
      type: String,
      default: "",
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", //San-Pham-1
      unique: true, //này nó sẽ giống như id để không bị trùng miền
    },
    createdBy: {
      // tạo bởi ai, thời gian nào?
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    // deleteAt: Date,
    deletedBy: {
      // tạo bởi ai, thời gian nào?
      account_id: String,
      deletedAt: Date,
    },
    // updatedBy: dùng array vì chỉnh sửa đc nhiều lần
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
