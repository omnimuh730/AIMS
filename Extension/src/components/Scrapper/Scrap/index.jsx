import React, { useState, useEffect } from 'react';

import {
	Badge, Button,
	Divider,
	CircularProgress,
	Typography,
	Box
} from '@mui/material';
import { } from '@mui/icons-material';
import PropTypes from 'prop-types'


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

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
		}, 800);
		return () => {
			clearInterval(timer);
		};
	}, []);

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
				<Button>Click</Button>
				{/* Scrapping Operation */}
				<p>button -- id -- index_not-interest-button__?(0)</p>
				<Button>Click</Button>
				<p>span -- class -- ant-radio ant-wave-target(5)</p>
				<Button>Click</Button>
				<p>button -- class ?index_not-interest-popup-button__?(1)</p>
				{/* wait to the list showing */}

			</div>

			<Divider sx={{ my: 2 }} />
			<h2>- items</h2>
			<p>id</p>
			<p>postedAgo</p>
			<p>tags</p>
			<p>company</p>
			<p>title</p>
			<p>details</p>
			<p>applicants</p>
			<p>description</p>
		</div>
	);
}

export default ScrapComponent;
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