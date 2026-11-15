import express from "express";
import {
  createResult,
  getMyResults,
} from "../controllers/result.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createResult).get(isAuthenticated, getMyResults);

export default router;
