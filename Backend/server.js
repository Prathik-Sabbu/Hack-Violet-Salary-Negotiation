import express from 'express';
import cors from 'cors';
import salaryroutes from './routes/salary.js';
import { initializeChat } from './services/Chat_service.js';
import messageroute from './routes/chat_messege.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Server is Working!',
  });
});



app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/salary', salaryroutes);
app.use('/api/chat', messageroute);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/salary?job=Software%20Engineer`);
  console.log(`   POST http://localhost:${PORT}/api/salary/calculate`);
  
  // Initialize chat on server startup
  await initializeChat();
});