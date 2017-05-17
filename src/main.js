import Promise from 'bluebird';
import mongoose from 'mongoose'
mongoose.Promise = Promise;
const config = require('config');
import HttpServer from './server/HttpServer';
import WorkerService from './service/WorkerService';
import WorkerRouter from './routers/WorkerRouter';
import EquipmentService from './service/WorkerService';
import EquipmentRouter from './routers/WorkerRouter';
import Worker from './model/Worker';
import Equipment from './model/Equipment';
import App from './server/App';
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;
mongoose.connect(url)
    .then(() => (Promise.resolve([new WorkerService(Worker), new EquipmentService(Equipment)])))
    .spread((workerService, equipmentService) => (
        [new WorkerRouter(workerService), new EquipmentRouter(equipmentService)]
    ))
    .spread((workerRouter, equipmentRouter) => {
        return new App({workerRouter, equipmentRouter});
    })
    .then((app) => {
        new HttpServer(app).start(config.get('server.port'));
    })
    .catch((err) => {
        console.log(err);
    });

