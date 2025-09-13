import React, { useState, useEffect, useRef } from 'react';

import {
	Badge, Button,
	Divider,
	CircularProgress,
	Typography,
	Box
} from '@mui/material';
import { } from '@mui/icons-material';
import PropTypes from 'prop-types'
import { useRuntime } from '../../../api/runtimeContext';
import useApi from '../../../api/useApi';
import { handleClear, handleAction, handleHighlight } from '../../../api/interaction';
import useNotification from '../../../api/useNotification';
function CircularProgressWithLabel(props) {
	return (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress variant="determinate" {...props} />
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: 'absolute',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography
					variant="caption"
					component="div"
					sx={{ color: 'text.secondary' }}
				>
					{`${Math.round(props.value)}%`}
				</Typography>
			</Box>
		</Box>
	);
}

CircularProgressWithLabel.propTypes = {
	/**
	 * The value of the progress indicator for the determinate variant.
	 * Value between 0 and 100.
	 * @default 0
	 */
	value: PropTypes.number.isRequired,
};

const ScrapComponent = () => {
	// Mock delay function
	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	const [progress, setProgress] = useState(10);
	const [scrapFlag, setScrapFlag] = useState(false);

	const { addListener, removeListener } = useRuntime();
	const notification = useNotification();
	const api = useApi();
	// Map of pending resolvers for fetch requests by identifier
	const pendingResolvers = useRef(new Map());

	useEffect(() => {
		const listener = (message) => {
			if (message?.action === 'to-extension') {
				// placeholder for future UI notifications
			}

			if (message?.action === 'fetchResult') {
				// message.payload should include { identifier?, success, data, error }
				const id = message.payload?.identifier;
				// store result in state
				if (id) {
					const resolver = pendingResolvers.current.get(id);
					if (resolver) {
						resolver(message.payload);
						pendingResolvers.current.delete(id);
					}
				}
			}
		};
		addListener(listener);
		return () => removeListener(listener);
	}, [addListener, removeListener]);

	async function onClickListItem() {
		handleClear();
		// Handle the click event for the list item
		handleHighlight("div", "class", "index_job-card-main-flip1-stop?");
		await delay(200);
		// send click (no identifier needed)
		handleAction("div", "class", "?index_job-card-main-flip1-stop?", 0, "click", "");
		await delay(200);
		setProgress(10);

		//Wait still job details screen is showing.
		let id = `scrap_wait_for_details_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_waitfor_jobdetails = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("div", "class", "?index_jobdetail-enter?", 0, "fetch", null, "text", id);
		await promise_waitfor_jobdetails;

		await delay(200);
		handleHighlight("a", "class", "?index_origin__?");
		id = `scrap_apply_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_applyLink = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("a", "class", "?index_origin__?", 0, "fetch", null, "content", id);
		const LinkComponent = await promise_applyLink;
		// <a class="index_origin__7NnDG" type="text" href="https://myjobs.adp.com/revecorecareers?__tx_annotation=false&amp;c=2207439&amp;d=External&amp;r=5001146699306&amp;rb=INDEED&amp;&amp;sor=adprm" target="_blank"><img alt="job-post-link" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" src="/newimages/public/file.svg" style="color: transparent;"><span>Original Job Post</span></a>

		const ApplyLink = LinkComponent?.success ? (new DOMParser().parseFromString(LinkComponent.data, 'text/html')).querySelector('a')?.href : null;
		setProgress(15);

		await delay(200);
		handleHighlight("div", "class", "?index_jobTag__?");
		id = `scrap_applicants_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_jobTag = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("div", "class", "?index_jobTag__?", 0, "fetch", null, "text", id);
		const ApplicantsNumber = await promise_jobTag;
		setProgress(20);

		await delay(200);
		handleHighlight("h2", "class", "?index_company-row__?");
		id = `scrap_company_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_companyRow = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("h2", "class", "?index_company-row__?", 0, "fetch", null, "content", id);
		/*
		<h2 class="ant-typography index_company-row__vOzgg css-120qcz2" style=""><strong>Revecore</strong><span class="index_publish-time___q_uC"> · 10 hours ago</span></h2>
		Need to get each 2 text item - strong tag(company name) and span tag(publish time)
		Remove ` · ` from the publish time
		*/
		const CompanyRawComponent = await promise_companyRow;
		const CompanyName = CompanyRawComponent?.success ? (new DOMParser().parseFromString(CompanyRawComponent.data, 'text/html')).querySelector('strong')?.innerText : null;
		const PublishTime = CompanyRawComponent?.success ? (new DOMParser().parseFromString(CompanyRawComponent.data, 'text/html')).querySelector('span')?.innerText.replace(' · ', '') : null;
		const CompanyRow = { CompanyName, PublishTime };
		setProgress(25);

		await delay(200);
		handleHighlight("h1", "class", "?index_job-title__?");
		id = `scrap_title_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_jobTitle = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("h1", "class", "?index_job-title__?", 0, "fetch", null, "text", id);
		const JobTitle = await promise_jobTitle;
		setProgress(30);

		await delay(200);
		handleHighlight("div", "class", "?index_job-metadata-row__?");
		id = `scrap_meta_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_job_metadata = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("div", "class", "?index_job-metadata-row__?", 0, "fetch", null, "content", id);

		const MetaTagsComponent = await promise_job_metadata;
		const MetaTags = MetaTagsComponent?.success ? Array.from((new DOMParser().parseFromString(MetaTagsComponent.data, 'text/html')).querySelectorAll('div.index_job-metadata-item__Wv_Xh')).reduce((acc, div) => {
			const key = div.querySelector('img')?.alt;
			const value = div.querySelector('span')?.innerText;
			if (key && value) {
				acc[key] = value;
			}
			return acc;
		}, {}) : {};
		setProgress(35);

		await delay(200);
		handleHighlight("p", "class", "?index_company-summary__?");
		id = `scrap_summary_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_company_summary = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("p", "class", "?index_company-summary__?", 0, "fetch", null, "text", id);
		const CompanySummary = await promise_company_summary;
		setProgress(40);

		await delay(200);
		handleHighlight("div", "class", "?index_companyTags?");
		id = `scrap_tags_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_companyTags = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("div", "class", "?index_companyTags?", 0, "fetch", null, "content", id);
		/* <div class="index_companyTags__Sb2uk ant-flex css-120qcz2" style="gap: 4px; outline: red solid 2px;" data-highlighter-original-outline="" data-highlighter-id="1" data-highlighter-outline="true"><span class="ant-tag css-120qcz2">Analytics</span><span class="ant-tag css-120qcz2">Management Consulting</span><span class="ant-tag css-120qcz2">Medical</span></div>

		Get Company Tags data as string array
		*/
		const CompanyTagsComponent = await promise_companyTags;
		const CompanyTags = CompanyTagsComponent?.success ? Array.from((new DOMParser().parseFromString(CompanyTagsComponent.data, 'text/html')).querySelectorAll('span.ant-tag')).map(span => span.innerText) : [];
		setProgress(45)

		await delay(200);
		handleHighlight("section", "class", "?index_sectionContent__?");
		id = `scrap_resp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_sectionContent1 = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("section", "class", "?index_sectionContent__?", 2, "fetch", null, "text", id);
		const Responsibilities = await promise_sectionContent1;
		setProgress(50);

		await delay(200);
		handleHighlight("section", "class", "?index_sectionContent__?");
		id = `scrap_qual_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_sectionContent2 = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("section", "class", "?index_sectionContent__?", 3, "fetch", null, "text", id);
		const Qualification = await promise_sectionContent2;
		setProgress(55);

		await delay(200);
		handleHighlight("section", "class", "?index_sectionContent__?");
		id = `scrap_ben_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_sectionContent3 = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("section", "class", "?index_sectionContent__?", 4, "fetch", null, "text", id);
		const Benefits = await promise_sectionContent3;
		setProgress(60);

		await delay(200);
		handleHighlight("div", "class", "?index_skill-matching-tags-area__?");
		id = `scrap_skill_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const promise_skill_matching = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
		handleAction("div", "class", "?index_skill-matching-tags-area__?", 0, "fetch", null, "text", id);
		//Result: "Java\nSpring Boot\nMicroservices\nSQL\nRESTful APIs\nAgile Methodologies\nGit\nDocker\nKubernetes"
		const SkillMatching = await promise_skill_matching;
		const Skills = SkillMatching?.success ? SkillMatching.data.split('\n').map(s => s.trim()).filter(Boolean) : [];
		setProgress(65);

		setProgress(70);
		handleHighlight("button", "id", "index_not-interest-button__?");
		await delay(200);
		// click
		handleAction("button", "id", "index_not-interest-button__?", 0, "click", "");
		await delay(200);
		setProgress(80);
		handleHighlight("label", "class", "?index_not-interest-popup-radio-item?");
		await delay(200);
		// click
		handleAction("label", "class", "?index_not-interest-popup-radio-item?", 5, "click", "");
		await delay(200);
		setProgress(90);
		handleHighlight("button", "class", "?index_not-interest-popup-button__?");
		await delay(200);
		// click
		handleAction("button", "class", "?index_not-interest-popup-button__?", 1, "click", "");
		await delay(200);
		setProgress(100);

		// Wait until job item list is showing
		// We need to wait until object_waitfor_joblist.success is false. If it gets true, step over, but if it's false, wait again to be true.
		let success_wait_for_job_list = false;

		while (!success_wait_for_job_list) {
			id = `scrap_wait_for_list_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
			const promise_waitfor_joblist = new Promise((resolve) => pendingResolvers.current.set(id, resolve));
			handleAction("div", "class", "?index_jobdetail-leave?", 0, "fetch", null, "content", id);
			const object_waitfor_joblist = await promise_waitfor_joblist;
			notification.info('Waiting for job list to reappear...');

			success_wait_for_job_list = object_waitfor_joblist?.success;

			if (!success_wait_for_job_list) {
				// wait for 1 second before next check
				await delay(500);
			}
		}
		/*
{
		id: 1,
		postedAgo: "22 minutes ago",
		tags: ["Be an early applicant", "2 former colleagues work here"],
		company: {
			name: "JRD Systems",
			logo: "https://via.placeholder.com/150/FFC107/000000?Text=JRD",
		},
		title: "Senior Java Developer",
		details: {
			location: "Downey, CA",
			isRemote: true,
			type: "Contract",
			level: "Senior Level",
			experience: "7+ years exp",
			salary: null,
		},
		applicants: {
			count: 24,
			text: "Less than 25 applicants",
		},
		description: `<strong>About the Role:</strong><br/>We are seeking a seasoned Senior Java Developer to join our dynamic team. The ideal candidate will have extensive experience in building high-performing, scalable, enterprise-grade applications.<br/><br/><strong>Responsibilities:</strong><ul><li>Design and develop high-volume, low-latency applications for mission-critical systems.</li><li>Contribute in all phases of the development lifecycle.</li><li>Write well-designed, testable, efficient code.</li></ul><strong>Requirements:</strong><ul><li>7+ years of proven working experience in Java development.</li><li>Hands on experience in designing and developing applications using Java EE platforms.</li><li>Object-Oriented analysis and design using common design patterns.</li></ul>`,
	}
*/
		// Collect all received result and put it into JSON schema
		/* example of ApplicantsNumber : {
			"identifier": "scrap_applicants_1757697955016_ipjk",
			"success": true,
			"data": "Be an early applicant\nLess than 25 applicants"
		}*/
		//Split the data by new line and trim each item
		const parseApplicantsTags = (data) => {
			return data.split('\n').map(tag => tag.trim()).filter(tag => tag);
		};

		const parsedTags = ApplicantsNumber?.success ? parseApplicantsTags(ApplicantsNumber.data) : [];

		const resultData = {
			applyLink: ApplyLink || "",
			id: Date.now(),
			postedAgo: PublishTime || "",
			tags: parsedTags,
			company: {
				name: CompanyName || "",
				tags: CompanyTags || [],
			},
			title: JobTitle?.success ? JobTitle.data : "",
			details: MetaTags || {},
			applicants: ApplicantsNumber?.success ? { count: parseInt(ApplicantsNumber.data.match(/\d+/)?.[0] || "0", 10), text: ApplicantsNumber.data } : { count: 0, text: "" },
			description: [Responsibilities?.success ? Responsibilities.data : "", Qualification?.success ? Qualification.data : "", Benefits?.success ? Benefits.data : ""].filter(s => s).join("\n\n"),
			skills: Skills || [],
		};
		notification.info('Scrap completed, saving job to backend...');
		// Send to backend
		try {
			// post to backend (assumes backend runs on localhost:3000)
			await api.post('http://localhost:3000/api/jobs', resultData);
			notification.success('Job saved successfully');
		} catch (err) {
			notification.error('Failed to save job');
		}
	}

	useEffect(() => {
		let active = true; // cancellation flag

		const run = async () => {
			while (active && scrapFlag) {
				try {
					await onClickListItem(); // wait until it fully finishes
				} catch (err) {
					console.error("Error in onClickListItem:", err);
				}
			}
		};

		if (scrapFlag) {
			run(); // start the async loop
		}

		return () => {
			active = false; // stop when unmounted or scrapFlag changes
		};
	}, [scrapFlag]);
	const onScrapStart = () => {
		setScrapFlag(true);
	}

	const onScrapStop = () => {
		setScrapFlag(false);
		setProgress(0);
	}

	return (
		<div>
			<h1>CheckList</h1>
			<Badge badgeContent={1} color='error'>
				<Button variant='outlined' color='primary'>Scrap</Button>
			</Badge>
			<CircularProgressWithLabel value={progress} />
			<Divider sx={{ my: 2 }} />

			<div>
				<p>div -- class -- index_job-card-main-flip1-stop?(0)</p>
				<Button onClick={onScrapStart} disabled={scrapFlag}>Click List Item</Button>
				<Button onClick={onScrapStop} disabled={!scrapFlag}>Stop</Button>
			</div>

			<Divider sx={{ my: 2 }} />
		</div>
	);
}

export default ScrapComponent;