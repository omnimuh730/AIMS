import express from "express";
import { getDailyApplications, getJobSources } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports/daily-applications", getDailyApplications);
router.get("/reports/job-sources", getJobSources);

export default router;
