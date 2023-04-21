import Eurika from "./eurika_helper.js";
import express from "express";

/**@type{express.RequestHandler}*/
export const requireAuth = async (req, res, next) => {
    const service = await Eurika.getClientByName("auth");
    const data = await service.get("/validate", { params: { ...req.params, authorization: req.query.authorization || null } });
    if (data.status !== 200) return res.status(data.status).json(data.data)
    req.user = data.data;
    next();
};
