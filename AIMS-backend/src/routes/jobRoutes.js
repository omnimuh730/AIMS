import express from "express";
import {
    createJob,
    getJobs,
    applyToJob,
    removeJobs,
    getJobStats,
    updateJobStatus,
    getJobKpis
} from "../controllers/jobController.js";

const router = express.Router();

router.post('/jobs', createJob);
router.get('/jobs', getJobs);
router.get('/jobs/stats', getJobStats);
router.get('/jobs/kpis', getJobKpis);
router.post('/jobs/remove', removeJobs);
router.post('/jobs/:id/apply', applyToJob);
router.post('/jobs/:id/status', updateJobStatus);

export default router;