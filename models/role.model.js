const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String, 
    description: String,
    permisiions: {
      type: Array,
      default: []
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

const Role = mongoose.model("Role", productSchema, "roles");

module.exports = Role;