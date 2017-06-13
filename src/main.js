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
//import logger from './lib/logger';
import {Mockgoose} from 'mockgoose';
let mockgoose = new Mockgoose(mongoose);
mongoose.Promise = Promise;
const ENV = config.get('ENV');
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;

if (ENV === 'localhost') {
    usual()
} else if (ENV === 'test') {
    mockgoose
        .prepareStorage()
        .then(usual)
}

function usual() {
    return mongoose
        .connect(url)
        .then(() => (
            Promise.resolve([new UserService(User), new WorkerService(Worker), new EquipmentService(Equipment)]))
        )
        .spread((userService, workerService, equipmentService) => (
            Promise.all([new UserController(userService), new WorkerController(workerService), new EquipmentController(equipmentService)])
        ))
        .spread((userController, workerController, equipmentController) => (
            Promise.all([new UserRouter({userController, authorizationCheck}), new WorkerRouter({
                workerController,
                authorizationCheck
            }), new EquipmentRouter({equipmentController, authorizationCheck})])
        ))
        .spread((userRouter, workerRouter, equipmentRouter) => {
            return new App({
                userRouter,
                workerRouter,
                equipmentRouter,
                passport: passport({userService: new UserService(User)})
            });
        })
        .then((app) => (
            new HttpServer(app).start(config.get('server.port'))
        ));
}

