import express from "express";
import {
	createJob,
	getJobs,
	applyToJob,
	removeJobs,
	getJobStats,
	updateJobStatus,
	getJobKpis,
	getJobSankey,
	getCompanyFocus,
	getTargetedSkills,
	getJobTitleBreakdown,
	getApplicationRhythm,
	getJobPostingVelocity,
	getWeeklyPostingCadence,
	getJobSpaceData,
	getSkillProfileAlignment,
	getSkillSynergy,
	getApplicationResponseLatency
} from "../controllers/jobController.js";

const router = express.Router();

router.post('/jobs', createJob);
router.get('/jobs', getJobs);
router.get('/jobs/stats', getJobStats);
router.get('/jobs/kpis', getJobKpis);
router.get('/jobs/sankey', getJobSankey);
router.get('/jobs/company-focus', getCompanyFocus);
router.get('/jobs/targeted-skills', getTargetedSkills);
router.get('/jobs/job-title-breakdown', getJobTitleBreakdown);
router.get('/jobs/application-rhythm', getApplicationRhythm);
router.get('/jobs/posting-velocity', getJobPostingVelocity);
router.get('/jobs/posting-cadence', getWeeklyPostingCadence);
router.get('/jobs/job-space', getJobSpaceData);
router.get('/jobs/skill-profile-alignment', getSkillProfileAlignment);
router.get('/jobs/skill-synergy', getSkillSynergy);
router.get('/jobs/response-latency', getApplicationResponseLatency);
router.post('/jobs/remove', removeJobs);
router.post('/jobs/:id/apply', applyToJob);
router.post('/jobs/:id/status', updateJobStatus);

export default router;