import express from "express";

/* For Admins */
import { adminRouter } from "./resources/admin";

export const restRouter = express.Router();
restRouter.use("/admin", adminRouter);
