import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Secure Ticketing System API is active' });
});

export default app;