import express from "express";
import { getDailyApplications, getJobSources, getJobSourceSummary } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports/daily-applications", getDailyApplications);
router.get("/reports/job-sources", getJobSources);
router.get("/reports/job-source-summary", getJobSourceSummary);

export default router;
