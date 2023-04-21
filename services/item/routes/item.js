import * as nsr from "node-server-router";
import { ItemModel } from "../models/item.js";
import { requireAuth } from "../middleware.js";

export default [
  {
    url: "items",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        try {
          const items = await ItemModel.find().lean();
          return res.status(200).json(items);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        try {
          const item = await ItemModel.findById(req.params._id).lean();
          return res.status(200).json(item);
        } catch {
          return res.status(404).json(null);
        }
      },
    ],
  },
  {
    url: "item",
    action: nsr.HTTPAction.POST,
    handlers: [
      requireAuth,
      async (req, res) => {
        try {
          const item = await ItemModel.create(req.body);
          return res.status(201).json(item);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "items",
    action: nsr.HTTPAction.POST,
    handlers: [
      requireAuth,
      async (req, res) => {
        try {
          req.body.forEach(async (item) => await ItemModel.create(item));
          return res.sendStatus(201);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.PATCH,
    handlers: [
      requireAuth,
      async (req, res) => {
        try {
          const item = await ItemModel.findByIdAndUpdate(
            { _id: req.params._id },
            { $set: { ...req.body } },
            { runValidators: true, new: true, upsert: false }
          );
          return res.status(200).json(item);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "item/:_id",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      requireAuth,
      async (req, res) => {
        try {
          await ItemModel.deleteOne({ _id: req.params._id });
          return res.sendStatus(204);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
];
