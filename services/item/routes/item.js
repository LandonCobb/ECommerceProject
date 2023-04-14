import * as nsr from "node-server-router";
import { ItemModel } from "../models/item.js";

export default [
  {
    url: "items",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        const items = await ItemModel.find().lean();
        return res.status(200).json(items);
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        const item = await ItemModel.findById(req.params._id).lean();
        return res.status(200).json(item);
      },
    ],
  },
  {
    url: "item",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        await ItemModel.create(req.body);
        return res.sendStatus(201);
      },
    ],
  },
  {
    url: "items",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        req.body.forEach(async (item) => await ItemModel.create(item));
        return res.sendStatus(201);
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.PATCH,
    handlers: [
      async (req, res) => {
        const item = await ItemModel.findByIdAndUpdate(
          { _id: req.params._id },
          { $set: { ...req.body } },
          { runValidators: true, new: true, upsert: false }
        );
        return res.status(200).json(item);
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      async (req, res) => {
        await ItemModel.deleteOne({ _id: req.params._id });
        return res.sendStatus(204);
      },
    ],
  },
];
