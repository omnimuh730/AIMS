import { Router } from 'express';
import {
    getPostingVelocity,
    getPostingCadence,
    getJobStats,
    getJobKpis,
    getJobSankey,
    getCompanyFocus,
    getTargetedSkills,
    getJobTitleBreakdown,
    getApplicationRhythm,
    getJobSpaceData,
    getSkillProfileAlignment,
    getSkillSynergy,
    getApplicationResponseLatency
} from '../controllers/reportController.js';

const router = Router();

router.get('/stats', getJobStats);
router.get('/kpis', getJobKpis);
router.get('/sankey', getJobSankey);
router.get('/company-focus', getCompanyFocus);
router.get('/targeted-skills', getTargetedSkills);
router.get('/job-title-breakdown', getJobTitleBreakdown);
router.get('/application-rhythm', getApplicationRhythm);
router.get('/posting-velocity', getPostingVelocity);
router.get('/posting-cadence', getPostingCadence);
router.get('/job-space', getJobSpaceData);
router.get('/skill-profile-alignment', getSkillProfileAlignment);
router.get('/skill-synergy', getSkillSynergy);
router.get('/response-latency', getApplicationResponseLatency);

export default router;