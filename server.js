import 'dotenv/config';
import express from 'express';
import winston from 'winston';
import webhookRoutes from './src/routes/webhookRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add other transports like File if needed
  ],
});

// This line should come before the routes
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

// Use the webhook routes
app.use('/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use((req, res, next) => {
  logger.info(`No route found for ${req.method} ${req.url}`);
  next();
});

app.use((req, res) => {
  logger.info(`Unhandled request: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});