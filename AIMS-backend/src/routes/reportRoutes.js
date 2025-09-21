import express from "express";
import { getDailyApplications } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports/daily-applications", getDailyApplications);

export default router;
