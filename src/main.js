import Promise from 'bluebird';
import mongoose from 'mongoose'
const config = require('config');
import HttpServer from './server/http-server';
import WorkerService from './service/WorkerService';
import WorkerRouter from './routers/WorkerRouter';
import EquipmentService from './service/WorkerService';
import EquipmentRouter from './routers/WorkerRouter';
import Worker from './model/Worker';
import Equipment from './model/Equipment';
import app from './server/app';
const httpServer = new HttpServer(app);
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;
mongoose.connect(url);

Promise.resolve(
    [new WorkerService(Worker), new EquipmentService(Equipment)]
).spread((workerService, equipmentService) => (
    [new WorkerRouter(workerService), new EquipmentRouter(equipmentService)]
)).spread((workerRouter, equipmentRouter) => {
    app.use('/worker', workerRouter);
    app.use('/equipment', equipmentRouter);
}).then(() => {
    httpServer.start(config.get('server.port'));
}).catch((err) => {
    console.log(err);
    httpServer.finish();
});

