import config from 'config';
import HttpServer from './server/HttpServer';
import AuthRouter from './router/AuthRouter';
import BasicRouter from './router/BasicRouter';
import WorkerRouter from './router/WorkerRouter';
import EquipmentRouter from './router/EquipmentRouter';
import WorkerController from './controller/WorkerController';
import AuthController from './controller/AuthController';
import EquipmentController from './controller/WorkerController';
import UserController from './controller/AuthController';
import WorkerService from './service/WorkerService';
import EquipmentService from './service/WorkerService';
import JWTService from './service/JWTService';

import UserService from './service/UserService';
import Worker from './model/Worker';
import User from './model/User';
import Equipment from './model/Equipment';
import App from './server/App';
import Passport from '../src/middleware/passport';
import authorizationCheck from '../src/middleware/authorizationCheck';
const ENV = config.get('ENV');
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;


const userService = new UserService(User);
const workerService = new WorkerService(Worker);
const equipmentService = new EquipmentService(Equipment);
const userController = new UserController(userService);
const workerController = new WorkerController(workerService);
const equipmentController = new EquipmentController(equipmentService);
const authController = new AuthController(userService);

let passport;
let authRouter;
let workerRouter;
let equipmentRouter;
let mongoose;
let redisClient;
let jwtService;

switch (ENV) {
    case 'test': {
        const mockRedisClient = require('./lib/MockRedisClient');
        const fakeMongoose = require('./lib/fakeMongoose');
        mongoose = fakeMongoose();
        redisClient = mockRedisClient();
        jwtService = new JWTService({redisClient});
        passport = new Passport({userService, jwtService});
        authRouter = new AuthRouter({authController, passport});
        workerRouter = new WorkerRouter({workerController});
        equipmentRouter = new EquipmentRouter({equipmentController});
        break;
    }
    case 'localhost': {
        const mockRedisClient = require('./lib/MockRedisClient');
        const fakeMongoose = require('./lib/fakeMongoose');
        mongoose = fakeMongoose();
        redisClient = mockRedisClient();
        jwtService = new JWTService({redisClient});
        passport = new Passport({userService, jwtService});
        authRouter = new AuthRouter({authController, passport, authorizationCheck});
        workerRouter = new WorkerRouter({workerController, authorizationCheck});
        equipmentRouter = new EquipmentRouter({equipmentController, authorizationCheck});
        break;
    }
    default: {
        const realRedisClient = require('./lib/RedisClient');
        const realMongoose = require('./lib/mongoose');
        mongoose = realMongoose();
        redisClient = realRedisClient();
        jwtService = new JWTService({redisClient});
        passport = new Passport({userService, jwtService});
        authRouter = new AuthRouter({authController, passport, authorizationCheck});
        workerRouter = new WorkerRouter({workerController, authorizationCheck});
        equipmentRouter = new EquipmentRouter({equipmentController, authorizationCheck});
        break;
    }
}


const basicRouter = new BasicRouter({authRouter, workerRouter, equipmentRouter});

const app = new App({
    basicRouter,
    passport,
});
const http = new HttpServer(app);


export function start() {
    return mongoose
        .connect(url)
        .then(() => (
            http.start(config.get('server.port'))
        ));
}

export function stop() {
    return new Promise((resolve) => (http.finish(resolve)))
        .then(() => {
            return mongoose.disconnect();
        })
}

