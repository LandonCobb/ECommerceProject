import * as nsr from "node-server-router";
import { CartModel } from "../models/cart.js";

export default [
  {
    url: "cart/:_id",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        try {
          const cart = await CartModel.findById(req.params._id).lean();
          return res.status(200).json(cart);
        } catch  {
          return res.status(404).json(null)
        }
      },
    ],
  },
  {
    url: "cart",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        try {
          const cart = await CartModel.create({});
          return res.status(201).json(cart);
        } catch {
          return res.sendStatus(400)
        }
      },
    ],
  },
  {
    url: "cart/:_id/:itemId",
    action: nsr.HTTPAction.PUT,
    handlers: [
      async (req, res) => {
        try {
          const cart = await CartModel.findByIdAndUpdate(
            { _id: req.params._id },
            { $push: { items: req.params.itemId } },
            { runValidators: true, new: true, upsert: false }
          );
          return res.status(201).json(cart);
        } catch {
          return res.sendStatus(400)
        }
      },
    ],
  },
  {
    url: "cart/:_id/:itemId",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      async (req, res) => {
        try {
          const cart = await CartModel.findByIdAndUpdate(
            { _id: req.params._id },
            { $pull: { items: req.params.itemId } },
            { runValidators: true, new: true, upsert: false }
          );
          return res.status(201).json(cart);
        } catch  {
          return res.sendStatus(400)
        }
      },
    ],
  },
  {
    url: "cart/:_id",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      async (req, res) => {
        try {
          const cart = await CartModel.findByIdAndUpdate(
            { _id: req.params._id },
            { $set: { items: [] } },
            { runValidators: true, new: true, upsert: false }
          );
          return res.status(201).json(cart);
        } catch {
          return res.sendStatus(400)
        }
      },
    ],
  },
];
