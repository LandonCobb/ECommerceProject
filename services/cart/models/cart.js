import mongoose from "mongoose";

const {Schema, model} = mongoose;

const cartSchema = new Schema({
    items: {
        type: [String],
        required: [true, "item list is required"],
        default: []
    }
}, {timestamps: true})

export const ItemModel = model("CART", cartSchema);

