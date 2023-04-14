import mongoose from "mongoose";

const {Schema, model} = mongoose;

const itemsSchema = new Schema({
    itemTitle: {
        type: String,
        required: [true, "item title is required"]
    },
    itemDescription: {
        type: String
    },
    itemUnitPrice: {
        type: Number,
        required: [true, "item price is required"]
    }
}, {timestamps: true})

export const ItemModel = model("ITEM", itemsSchema);

