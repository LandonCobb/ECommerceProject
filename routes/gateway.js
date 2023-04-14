import * as nsr from "node-server-router";
import Eurika from "../eurika_helper.js";

export default [
  {
    url: ":service/*",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        const service = await Eurika.getClientByName(req.params.service);
        const data = await service.get(
          `/${req.path.split("/").slice(2).join("/")}`,
          { params: req.params }
        );
        return res.status(data.status).json(data.data);
      },
    ],
  },
  {
    url: ":service/*",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        const service = await Eurika.getClientByName(req.params.service);
        const data = await service.post(
          `/${req.path.split("/").slice(2).join("/")}`,
          { data: req.body, params: req.params }
        );
        return res.status(data.status).json(data.data);
      },
    ],
  },
  {
    url: ":service/*",
    action: nsr.HTTPAction.PUT,
    handlers: [
      async (req, res) => {
        const service = await Eurika.getClientByName(req.params.service);
        const data = await service.put(
          `/${req.path.split("/").slice(2).join("/")}`,
          { data: req.body, params: req.params }
        );
        return res.status(data.status).json(data.data);
      },
    ],
  },
  {
    url: ":service/*",
    action: nsr.HTTPAction.PATCH,
    handlers: [
      async (req, res) => {
        const service = await Eurika.getClientByName(req.params.service);
        const data = await service.patch(
          `/${req.path.split("/").slice(2).join("/")}`,
          { data: req.body, params: req.params }
        );
        return res.status(data.status).json(data.data);
      },
    ],
  },
  {
    url: ":service/*",
    action: nsr.HTTPAction.DELETE,
    handlers: [
      async (req, res) => {
        const service = await Eurika.getClientByName(req.params.service);
        const data = await service.delete(
          `/${req.path.split("/").slice(2).join("/")}`,
          { params: req.params }
        );
        return res.status(data.status).json(data.data);
      },
    ],
  },
];
