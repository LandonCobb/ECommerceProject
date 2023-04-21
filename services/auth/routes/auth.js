import * as nsr from "node-server-router";
import { UserModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

const VERY_SECRET_TOKEN = "123456789";

export default [
  {
    url: "login",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        try {
          const { username, password } = req.body;
          if (!username || !password)
            return res.status(401).json({ message: "Invalid credentials" });
          const user = await UserModel.findOne({ username });
          if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
          if (!bcrypt.compareSync(password, user.password))
            return res.status(401).json({ message: "Invalid credentials" });
          const accessToken = sign({ _id: user._id }, VERY_SECRET_TOKEN, {
            expiresIn: "1h",
          });
          const refreshToken = sign({ _id: user._id }, VERY_SECRET_TOKEN, {
            expiresIn: "3h",
          });
          return res.status(200).json({
            token: accessToken,
            refreshToken: refreshToken,
          });
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "register",
    action: nsr.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        try {
          const { password, ...rest } = req.body;
          const user = await UserModel.create({
            ...rest,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          });
          delete user.password;
          return res.status(200).json(user);
        } catch {
          return res.sendStatus(400);
        }
      },
    ],
  },
  {
    url: "validate",
    action: nsr.HTTPAction.GET,
    handlers: [
      async (req, res) => {
        try {
          const { authorization } = req.query;
          const token = authorization && authorization.split(" ")[1];
          if (token == null)
            return res.status(403).json({ error: "Failed to login" });
          verify(token, VERY_SECRET_TOKEN, async (err, id) => {
            if (err)
              return res.status(403).json({
                error: "Invalid token. Please try again.",
              });
            const user = await UserModel.findById(id);
            if (!user)
              return res.status(404).json({ error: "user not found" });
            return res.status(200).json(user)
          });
        } catch (err) {
          return res.status(500).json({ error: `${err}` });
        }
      },
    ],
  },
];
