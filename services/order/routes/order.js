import * as nsr from "node-server-router";
import { OrderModel } from "../models/order.js";

export default [
  {
    url: "orders",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        try {
          const orders = await OrderModel.find().lean();
          return res.status(200).json(orders);
        } catch {
          return res.sendStatus(400)
        }
      },
    ],
  },
  {
    url: "order/:_id",
    action: nsr.HTTPAction.GET,
    handlers: [async (req, res) => {
      try {
        const order = await OrderModel.findById(req.params._id)
        return res.status(200).json(order)
      } catch {
        return res.status(404).json(null)
      }
    }]
  },
  {
    url: "order",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        try {
          const item = await OrderModel.create(req.body);
          return res.status(201).json(item);
        } catch  {
          return res.sendStatus(400)
        }
      }
    ]
  },
  {
    url: "order/:_id",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      async (req, res) => {
        try {
          await OrderModel.deleteOne({ _id: req.params._id });
          return res.sendStatus(204);
        } catch {
          return res.sendStatus(400)
        }
      },
    ],
  }
];
