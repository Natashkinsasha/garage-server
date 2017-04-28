import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cookieSession from 'express-session';
import config from 'config';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(morgan('combined'));
app.use(cookieParser());
app.use(cookieSession({...config.get('session')}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


export default app;