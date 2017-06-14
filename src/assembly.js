import Promise from 'bluebird';
import mongoose from 'mongoose'
import config from 'config';
import HttpServer from './server/HttpServer';
import UserRouter from './router/UserRouter';
import WorkerRouter from './router/WorkerRouter';
import EquipmentRouter from './router/EquipmentRouter';
import WorkerController from './controller/WorkerController';
import EquipmentController from './controller/WorkerController';
import UserController from './controller/UserController';
import WorkerService from './service/WorkerService';
import EquipmentService from './service/WorkerService';
import UserService from './service/UserService';
import Worker from './model/Worker';
import User from './model/User';
import Equipment from './model/Equipment';
import App from './server/App';
import passport from '../src/middleware/passport';
import authorizationCheck from '../src/middleware/authorizationCheck';
mongoose.Promise = Promise;
const ENV = config.get('ENV');
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;


const userService = new UserService(User);
const workerService = new WorkerService(Worker);
const equipmentService = new EquipmentService(Equipment);
const userController = new UserController(userService);
const workerController = new WorkerController(workerService);
const equipmentController = new EquipmentController(equipmentService);
let userRouter;
let workerRouter;
let equipmentRouter;
if (ENV === 'test') {
    userRouter = new UserRouter({userController});
    workerRouter = new WorkerRouter({workerController});
    equipmentRouter = new EquipmentRouter({equipmentController});
} else {
    userRouter = new UserRouter({userController, authorizationCheck});
    workerRouter = new WorkerRouter({workerController, authorizationCheck});
    equipmentRouter = new EquipmentRouter({equipmentController, authorizationCheck});
}

const app = new App({
    userRouter,
    workerRouter,
    equipmentRouter,
    passport: passport({userService: new UserService(User)})
});
const http = new HttpServer(app);

export function start() {
    if (ENV === 'test') {
        const Mockgoose = require('mockgoose').Mockgoose;
        const mockgoose = new Mockgoose(mongoose);
        return mockgoose
            .prepareStorage()
            .then(() => (mongoose.connect('mongodb://example.com/TestingDB')))
            .then(() => {
                http.start(config.get('server.port'))
            });
    } else {
        return mongoose
            .connect(url)
            .then(() => (
                http.start(config.get('server.port'))
            ));
    }
}

export function stop() {
    return new Promise((resolve) => (http.finish(resolve)))
        .then(() => {
            return mongoose.disconnect();
        })
}

