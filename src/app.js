import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'

const app = express();

const workerRouter = require('./routers/workerRouter');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/worker', workerRouter);
export default app;
