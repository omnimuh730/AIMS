import express from "express";
import {
	createJob,
	getJobs,
	applyToJob,
	removeJobs,
	updateJobStatus,
	unapplyFromJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post('/jobs', createJob);
router.post('/jobs/list', getJobs);
router.post('/jobs/remove', removeJobs);
router.post('/jobs/:id/apply', applyToJob);
router.post('/jobs/:id/status', updateJobStatus);
router.post('/jobs/:id/unapply', unapplyFromJob);

export default router;
