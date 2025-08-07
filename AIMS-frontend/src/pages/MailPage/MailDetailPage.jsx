import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const BACKEND_URL = "http://localhost:3000";

const MailDetailPage = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/emails`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.id === id);
        setEmail(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography>Loading email...</Typography>;
  if (!email) return <Typography>Email not found.</Typography>;

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">{email.subject}</Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="subtitle2">From: {email.from}</Typography>
          {email.labelIds && email.labelIds.map(label => (
            <Chip key={label} label={label} size="small" />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {email.date ? new Date(email.date).toLocaleString() : ''}
        </Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: email.body || email.snippet }} />
      </Paper>
    </Box>
  );
};

export default MailDetailPage;