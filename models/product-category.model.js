const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String, //San Pham 1
    parent_id: {
        type: String,
        default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
        type: String, 
        slug: "title",//San-Pham-1
        unique: true //này nó sẽ giống như id để không bị trùng miền
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true // time stamps của mongoose 
    //để truyền thời gian tạo và update
}
)

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = ProductCategory;