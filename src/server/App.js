import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import config from 'config';

import errorHandler from '../middleware/errorHandler';
import logger from '../middleware/logger';
import validator from '../middleware/validator';

const LocalStrategy = require('passport-local').Strategy;
const objectID = require('mongodb').ObjectID;


export default ({userRouter, workerRouter, equipmentRouter, passport}) => {
    const app = express();
    app.use(logger());
    app.use(cookieParser());
    app.use(cookieSession({...config.get('session')}));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(validator());
    app.use(`/${config.get('version')}/api/workers`, workerRouter);
    app.use(`/${config.get('version')}/api/equipments`, equipmentRouter);
    app.use(`/${config.get('version')}/api`, userRouter);
    app.use(errorHandler());
    return app;
};