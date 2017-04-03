import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
const workerRouter = require('./routers/workerRouter');

const app = express();
console.log(workerRouter())

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/worker', workerRouter());



export default app;