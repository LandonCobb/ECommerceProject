import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "item title is required"],
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "a password is required"]
    },
}, {timestamps: true})

export const UserModel = model("USER", userSchema);

