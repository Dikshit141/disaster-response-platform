// backend/index.js
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const disasterRoutes = require('./routes/disasters');
const socialMediaRoutes = require('./routes/socialMedia');
const resourceRoutes = require('./routes/resources');
const updateRoutes = require('./routes/updates');
const verifyRoutes = require('./routes/verify');
const geocodeRoutes = require('./routes/geocode');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Disaster Response API is live ✅');
  });
  

// API Routes
app.use('/disasters', disasterRoutes(io, supabase));
app.use('/social-media', socialMediaRoutes(io, supabase));
app.use('/resources', resourceRoutes(io, supabase));
app.use('/official-updates', updateRoutes(io, supabase));
app.use('/verify-image', verifyRoutes(supabase));
app.use('/geocode', geocodeRoutes(supabase));

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
