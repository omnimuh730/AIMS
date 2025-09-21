import React, { useState, useEffect } from "react";
import {
	Drawer,
	Box,
	IconButton,
	Typography,
	Divider,
	Stack,
	Button,
	Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const JobDetailDrawer = ({ job, open, onClose, onAskgllama, onSkillsChanged, onApply }) => {
	const [skillsChanged, setSkillsChanged] = useState(false);
	if (!job) return null;

	// Wrap onClose to notify parent if skills changed
	const handleClose = () => {
		onClose && onClose();
		if (skillsChanged && onSkillsChanged) {
			onSkillsChanged();
			setSkillsChanged(false);
		}
	};

	return (
		<Drawer anchor="right" open={open} onClose={handleClose}>
			<Box
				sx={{
					width: { xs: "100vw", sm: 500, md: 1000 },
					p: 5,
					pt: 15,
					position: "relative",
					height: "100%",
				}}
			>
				<IconButton
					onClick={handleClose}
					sx={{ position: "absolute", top: 16, right: 16 }}
				>
					<CloseIcon />
				</IconButton>

				<Stack direction="row" spacing={1} alignItems="center">
					<Typography variant="h5" fontWeight="bold">
						{job.title}
					</Typography>
					{job.applied ? <Chip label="Applied" size="small" color="success" icon={<CheckIcon />} /> : null}
				</Stack>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					{job.company.name} &middot; {(job.details && (job.details.location || job.details.position))}
				</Typography>
				{/* Company tags */}
				{Array.isArray(job.company.tags) && job.company.tags.length > 0 && (
					<Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
						{job.company.tags.map(t => (
							<Chip key={t} label={t} size="small" variant="outlined" />
						))}
					</Stack>
				)}
				<Divider sx={{ my: 2 }} />

				{/* Skill tags - clickable toggle chips */}
				{Array.isArray(job.skills) && job.skills.length > 0 && (
					<SkillChips skills={job.skills} onSkillsChanged={() => setSkillsChanged(true)} />
				)}

				<Box sx={{ overflowY: "auto", height: "calc(100% - 150px)" }}>
					{typeof job.description === 'string' && /<\w+.*?>/.test(job.description) ? (
						// If description contains HTML tags, render as HTML
						<Box dangerouslySetInnerHTML={{ __html: job.description }} />
					) : (
						// Plain text - preserve newlines
						<Box sx={{ whiteSpace: 'pre-line' }}>{job.description}</Box>
					)}
				</Box>

				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						p: 2,
						bgcolor: "background.paper",
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="flex-end"
					>
						<Button
							variant="outlined"
							startIcon={<FlashOnIcon />}
							onClick={onAskgllama}
							size="small"
							sx={{
								textTransform: "none",
								borderRadius: "20px",
							}}
						>
							Ask gllama
						</Button>
						<Button
							variant="contained"
							color="primary"
							size="small"
							sx={{
								textTransform: "none",
								bgcolor: "#00C853",
								"&:hover": { bgcolor: "#00B843" },
								borderRadius: "20px",
							}}
							onClick={async () => {
								try {
									if (onApply && job) await onApply(job);
								} catch (e) { }
								if (job && job.applyLink) {
									window.open(job.applyLink, "_blank", "noopener,noreferrer");
								}
							}}
						>
							Apply Now
						</Button>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
};

export default JobDetailDrawer;

// Small internal component to handle clickable/toggleable skill chips
const SkillChips = ({ skills = [], onSkillsChanged }) => {
	// selected is a Set<string> of skills saved in personal_info
	const [selected, setSelected] = useState(() => new Set());
	const [loadingMap, setLoadingMap] = useState(() => ({})); // prevent concurrent toggles per-skill

	const API_BASE = import.meta.env.VITE_API_BASE;

	// Fetch saved skills on mount
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(`${API_BASE}/api/personal/skills`);
				if (!mounted) return;
				if (!res.ok) {
					console.warn('GET /api/personal/skills returned', res.status, res.statusText);
					return;
				}
				// try to parse JSON safely
				let data;
				try { data = await res.json(); } catch (e) { console.warn('Failed to parse JSON from /api/personal/skills', e); return; }
				if (data && data.success && Array.isArray(data.skills)) {
					setSelected(new Set(data.skills));
				}
			} catch (err) {
				console.warn('Failed to fetch personal skills', err);
			}
		})();
		return () => { mounted = false; };
	}, []);

	// Reset nothing when skills prop changes; keep user's saved selection

	const toggle = async (skill) => {
		if (loadingMap[skill]) return; // already toggling
		const isSelected = selected.has(skill);
		try {
			setLoadingMap(prev => ({ ...prev, [skill]: true }));
			let res, data;
			if (!isSelected) {
				// add
				res = await fetch(`${API_BASE}/api/personal/skills`, {
					method: 'POST', headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ skill })
				});
			} else {
				// remove
				res = await fetch(`${API_BASE}/api/personal/skills`, {
					method: 'DELETE', headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ skill })
				});
			}

			if (!res.ok) {
				// server returned 404/500 etc
				const text = await res.text().catch(() => null);
				console.warn('Toggle skill request failed', res.status, res.statusText, text);
			} else {
				// try parse JSON
				try { data = await res.json(); } catch (e) { console.warn('Failed to parse JSON from toggle response', e); }
				if (data && data.success && Array.isArray(data.skills)) {
					setSelected(new Set(data.skills));
					if (onSkillsChanged) onSkillsChanged();
				} else {
					// If server returned ok but no skills array, log and do nothing
					if (!(data && data.success)) console.warn('Toggle skill response did not include success/skills', data);
				}
			}
		} catch (e) {
			console.error('Toggle skill failed', e);
		} finally {
			setLoadingMap(prev => {
				const next = { ...prev };
				delete next[skill];
				return next;
			});
		}
	};

	return (
		<Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
			{skills.map(s => {
				const isSelected = selected.has(s);
				const busy = !!loadingMap[s];
				return (
					<Chip
						key={s}
						label={s}
						size="small"
						variant={isSelected ? 'filled' : 'outlined'}
						color={isSelected ? 'primary' : 'error'}
						onClick={() => toggle(s)}
						icon={isSelected ? <CheckIcon sx={{ color: 'white' }} /> : <CancelIcon />}
						sx={{ cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}
					/>
				);
			})}
		</Stack>
	);
};

/** 
{
	"applyLink": "https://benefis.wd1.myworkdayjobs.com/bhs/job/Remote-USA/Interface-Engineer--Exempt-_JR104744",
		"id": 1757698370903,
			"postedAgo": "32 minutes ago",
				"tags": [
					"98 applicants"
				],
					"company": {
		"name": "Benefis Health System",
			"tags": [
				"Health Care",
				"Hospital",
				"Non Profit",
				"Primary and Urgent Care"
			]
	},
	"title": "Interface Engineer (Exempt)",
		"details": {
		"position": "Remote USA",
			"time": "Full-time",
				"remote": "Remote",
					"seniority": "Mid, Senior Level",
						"date": "5+ years exp"
	},
	"applicants": {
		"count": 98,
			"text": "98 applicants"
	},
	"description": "Responsibilities\nResponsible for implementing integration techniques to link data between functions in separate applications, and for the translation of data between disparate systems.\nBuilds, configures, and tests interfaces using various technologies to connect and exchange data between information systems applications within the health system.\nEnhances, monitors, tests, and troubleshoots existing interfaces and interacts with ITS applications staff and end users to ensure existing systems are meeting end user needs and working effectively.\nMakes recommendation as to the use and the replacement or purchase of a new interface engine.\nDemonstrates the ability to deal with pressure to meet deadlines, to be accurate, and to handle constantly changing situations.\nDemonstrates the ability to deal with a variety of people, deal with stressful situations, and handle conflict.\nWill perform all job duties or job tasks as assigned.\nWill follow and adhere to all requirements, regulations and procedures of any licensing board or agency.\nMust comply with all Benefis Health System’s organization policies and procedures.\n\nQualification\nRepresents the skills you have\n\nFind out how your skills align with this job's requirements. If anything seems off, you can easily click on the tags to select or unselect skills to reflect your actual expertise.\n\nInterface development\nData integration\nHealth care experience\nTeam collaboration\nProject management\nRequired\nBachelor’s degree in Computer Science, Software Engineering or equivalent technical experience required.\nFive years’ experience in developing and maintaining interfaces required.\nAbility to work in a fast-paced environment and manage multiple projects.\nPreferred\nFive years’ experience in a health care environment preferred.\nExperience collaborating with and organizing large teams.",
		"_createdAt": "2025-09-12T17:32:50.927Z"
}
*/
