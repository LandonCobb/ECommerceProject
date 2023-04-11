import express from "express";
import * as nsr from "node-server-router";
import cors from "cors";

const { json, urlencoded } = express;
const app = express();

app.set("trust proxy", true);

app.use(urlencoded({ limit: "50mb", extended: true }));

app.use(json({ limit: "50mb", extended: true }));

app.use(cors());

app.use((req, _, next) => {
  console.log(`[${process.pid}] ${req.method} ${req.url}`);
  next();
});

app.options("*", cors());

nsr.RouteFactory.applyRoutesTo(app, { log_configured: true });

app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello world" });
});

app.listen(1000, () =>
  console.log(`[${process.pid}] Gateway running on port 1000`)
);
