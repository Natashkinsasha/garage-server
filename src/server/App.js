import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import config from 'config';
import passport from 'passport';
import expressValidator from 'express-validator';
import reduce from 'lodash/reduce';
const LocalStrategy = require('passport-local').Strategy;
const objectID = require('mongodb').ObjectID;


export default ({workerRouter, equipmentRouter}) => {
    const app = express();
    app.use(morgan('combined'));
    app.use(cookieParser());
    //app.use(cookieSession({...config.get('session')}));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(expressValidator({
        customValidators: {
            isObjectId: (value) => {
                return objectID.isValid(value);
            },
            isArrayObjectId: (value) => {
                return reduce(value, (result, iteam) => {
                    return result && objectID.isValid(iteam)
                }, true);
            },
            isDirection: (value) => {
                return value === 'ascending' || value === 'descending';
            }
        }
    }));
    workerRouter && app.use('/api/workers', workerRouter);
    equipmentRouter && app.use('/api/equipments', equipmentRouter);
    app.use((err, req, res, next) => {
        console.log(err)
        res.status(500).send('Server error');
    });
    return app;
};