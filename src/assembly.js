import config from 'config';
import realMongoose from './lib/mongoose';
import fakeMongoose from './lib/fakeMongoose';
import mockRedisClient from './lib/MockRedisClient';
import realRedisClient from './lib/RedisClient';
import HttpServer from './server/HttpServer';
import AuthRouter from './router/AuthRouter';
import BasicRouter from './router/BasicRouter';
import WorkerRouter from './router/WorkerRouter';
import EquipmentRouter from './router/EquipmentRouter';
import WorkerController from './controller/WorkerController';
import EquipmentController from './controller/WorkerController';
import UserController from './controller/AuthController';
import WorkerService from './service/WorkerService';
import EquipmentService from './service/WorkerService';
import UserService from './service/UserService';
import Worker from './model/Worker';
import User from './model/User';
import Equipment from './model/Equipment';
import App from './server/App';
import passport from '../src/middleware/passport';
import authorizationCheck from '../src/middleware/authorizationCheck';
const ENV = config.get('ENV');
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;


const userService = new UserService(User);
const workerService = new WorkerService(Worker);
const equipmentService = new EquipmentService(Equipment);
const userController = new UserController(userService);
const workerController = new WorkerController(workerService);
const equipmentController = new EquipmentController(equipmentService);
let authRouter;
let workerRouter;
let equipmentRouter;
let mongoose;
let redisClient;

switch(ENV) {
    case 'test': {
        authRouter = new AuthRouter({userController, passport});
        workerRouter = new WorkerRouter({workerController});
        equipmentRouter = new EquipmentRouter({equipmentController});
        mongoose = fakeMongoose();
        redisClient = mockRedisClient();
        break;
    }
    case 'localhost': {
        authRouter = new AuthRouter({userController, passport, authorizationCheck});
        workerRouter = new WorkerRouter({workerController, authorizationCheck});
        equipmentRouter = new EquipmentRouter({equipmentController, authorizationCheck});
        mongoose = fakeMongoose();
        redisClient = mockRedisClient();
        break;
    }
    default: {
        authRouter = new AuthRouter({userController, passport, authorizationCheck});
        workerRouter = new WorkerRouter({workerController, authorizationCheck});
        equipmentRouter = new EquipmentRouter({equipmentController, authorizationCheck});
        mongoose = realMongoose();
        redisClient = realRedisClient();
        break;
    }
}


const basicRouter = new BasicRouter({authRouter, workerRouter, equipmentRouter});

const app = new App({
    basicRouter,
    passport: passport({userService: new UserService(User)})
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

