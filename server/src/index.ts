import express from 'express';
import cors from 'cors';
import curriculumsRouter from './routes/curriculums.js';
import sectionsRouter from './routes/sections.js';
import itemsRouter from './routes/items.js';
import exportRouter from './routes/export.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api', curriculumsRouter);
app.use('/api', sectionsRouter);
app.use('/api', itemsRouter);
app.use('/api', exportRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
