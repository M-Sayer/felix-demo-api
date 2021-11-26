import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { NODE_ENV } from './config.js';
// Middleware
import { errorHandler } from './middleware/errorHandler.js';
// Routers
import { usersRouter } from './routes/users/usersRouter.js';
import { goalsRouter } from './routes/goals/goalsRouter.js';
import { transactionsRouter } from './routes/transactions/transactionsRouter.js';
import { alertsRouter } from './routes/alerts/alertsRouter.js';

const app = express();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(json());

app.use('/api/users', usersRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/alerts', alertsRouter);

app.use(errorHandler);

export default app;
