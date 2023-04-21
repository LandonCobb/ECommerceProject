import mongoose from "mongoose";

const {Schema, model} = mongoose;

const orderSchema = new Schema({
    cart: {
        type: String,
        required: [true, "cart is required"]
    },
    user: {
        type: String,
        required: [true, "user is required"]
    }
}, {timestamps: true})

export const OrderModel = model("ORDER", orderSchema);

