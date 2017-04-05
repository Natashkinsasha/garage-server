import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());


export default app;