import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import apiRoutes from './routes/apiRoutes';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}>('/', (req, res) => {
  res.json({
    message: 'You are connected to the API server',
  });
});

app.use('/api', apiRoutes);

export default app;
