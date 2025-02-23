require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

import cors from "cors";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";

import { handleError } from "./middlewares/handleError";
import logger from "./config/winston";

const app = express();



app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", authRouter);


app.get("/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
  });
});

app.use(handleError);

AppDataSource.initialize()
  .then(() => {
    const port = Number(process.env.PORT) || 5432;
    app.listen(port, () => {
      logger.info(`O servidor está rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
