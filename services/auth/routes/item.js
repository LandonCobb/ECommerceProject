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
];
