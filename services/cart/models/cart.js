import mongoose from "mongoose";

const {Schema, model} = mongoose;

const cartSchema = new Schema({
    items: {
        type: [String],
        required: [true, "item list is required"],
        default: []
    },
    expires: {
        type: Date,
        required: [true, "Date is required"],
        default: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
    }
}, {timestamps: true})

export const CartModel = model("CART", cartSchema);

