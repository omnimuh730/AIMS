import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List, ListItem, ListItemText, ListItemButton, Typography, Chip, Box
} from '@mui/material';

const BACKEND_URL = "http://localhost:3000";

const MailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/emails`)
      .then(res => res.json())
      .then(data => {
        setEmails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Loading emails...</Typography>;
  if (!emails.length) return <Typography>No emails found.</Typography>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>Inbox</Typography>
      <List>
        {emails.map(email => (
          <ListItemButton
            key={email.id}
            onClick={() => navigate(`/mail/${email.id}`)}
            sx={{ borderRadius: 2, mb: 1, boxShadow: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold" component="span">{email.from}</Typography>
                    {email.labelIds && email.labelIds.map(label => (
                      <Chip key={label} label={label} size="small" sx={{ ml: 1 }} />
                    ))}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" component="span">{email.subject}</Typography>{' '}
                    <Typography variant="body2" color="text.secondary" noWrap component="span">
                      {email.body?.replace(/<[^>]+>/g, '').slice(0, 80) || email.snippet}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {email.date ? new Date(email.date).toLocaleString() : ''}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default MailPage;