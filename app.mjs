import express from "express";
import * as nsr from "node-server-router";
import cors from "cors";


const { json, urlencoded } = express;
const app = express();

app.set("trust proxy", true);

app.use(urlencoded({limit: "50mb"}));

app.use(json({limit: "50mb"}));

app.use(cors());

app.options("*", cors());

nsr.RouteFactory.applyRoutesTo(app);

app.listen(1000);





