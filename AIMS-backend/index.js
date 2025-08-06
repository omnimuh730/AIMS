const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('notification', 'Welcome to the Socket.IO server!');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setInterval(() => {
  io.emit('notification', 'This is a periodic notification from the server.');
  console.log('Sent notification');
}, 5000);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'; // Vite default

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'client_secret.json');

async function getOAuth2Client() {
  const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

async function loadSavedCredentials() {
  try {
    const token = await fs.readFile(TOKEN_PATH);
    return JSON.parse(token);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(tokens) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
}

// Route to get OAuth URL
app.get('/auth-url', async (req, res) => {
  try {
    const oAuth2Client = await getOAuth2Client();
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }
  try {
    const oAuth2Client = await getOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await saveCredentials(tokens);
    res.redirect(`${CLIENT_URL}/test?gmail=success`);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Route to fetch emails
app.get('/emails', async (req, res) => {
  try {
    const tokens = await loadSavedCredentials();
    if (!tokens) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const oAuth2Client = await getOAuth2Client();
    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    let nextPageToken = null;
    const allMessages = [];
    do {
      const resp = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        pageToken: nextPageToken,
      });
      const messages = resp.data.messages || [];
      allMessages.push(...messages);
      nextPageToken = resp.data.nextPageToken;
    } while (nextPageToken && allMessages.length < 10); // Limit to 10 for demo
    const detailedMessages = [];
    for (const message of allMessages) {
      try {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full',
        });
        const headers = msg.data.payload.headers;
        const emailData = {
          id: msg.data.id,
          threadId: msg.data.threadId,
          labelIds: msg.data.labelIds,
          snippet: msg.data.snippet,
          from: headers.find(h => h.name === 'From')?.value || '',
          subject: headers.find(h => h.name === 'Subject')?.value || '',
          body: extractBody(msg.data.payload),
        };
        detailedMessages.push(emailData);
      } catch (error) {
        console.error(`Error fetching message ${message.id}:`, error.message);
      }
    }
    res.json(detailedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

function extractBody(payload) {
  let body = '';
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.mimeType === 'text/html' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.parts) {
        body += extractBody(part);
      }
    }
  } else if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }
  return body;
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});