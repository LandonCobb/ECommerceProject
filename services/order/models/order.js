import mongoose from "mongoose";

const {Schema, model} = mongoose;

const orderSchema = new Schema({
    cart: {
        type: String,
        required: [true, "cart is required"]
    },
    user: {
        type: {},
        required: [true, "user is required"],
        default: {}
    }
}, {timestamps: true})

export const ItemModel = model("ORDER", orderSchema);

