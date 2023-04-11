import express from "express";
import * as nsr from "node-server-router";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import mongoose from "mongoose";
import Eurika from "./eurika_helper.js";

console.log("penis");

try {
  // if (cluster.isPrimary) {
  //     for (var _ = 0; _ < os.cpus().length; _++) cluster.fork();
  //     cluster.on("exit", (worker, _code, _signal) => {
  //       console.log(`[${worker.process.pid}] Died`);
  //       cluster.fork();
  //     });
  //   } else {
  //   }
  const { json, urlencoded } = express;
  const app = express();
  app.set("trust proxy", true);
  app.use(urlencoded({ limit: "50mb", extended: true }));
  app.use(json({ limit: "50mb", extended: true }));
  app.use(cors());
  app.options("*", cors());
  nsr.RouteFactory.applyRoutesTo(app, { log_configured: true });
  mongoose
    .connect("mongodb://localhost:8989/ItemDB", {
      dbName: "ecommerce",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch(console.log);
  mongoose.connection.on("connected", () =>
    console.log(`[${process.pid}] Connected to MongoDB`)
  );
  Eurika.registerWithEureka("item", 1000)
  app.listen(1000, () =>
    console.log(`[${process.pid}] Listening on port ${1000}`)
  );
} catch (error) {
  console.log(error);
}
