import express from "express";
import {
    createJob,
    getJobs,
    applyToJob,
    removeJobs,
    getJobStats
} from "../controllers/jobController.js";

const router = express.Router();

router.post('/jobs', createJob);
router.get('/jobs', getJobs);
router.get('/jobs/stats', getJobStats);
router.post('/jobs/remove', removeJobs);
router.post('/jobs/:id/apply', applyToJob);

export default router;