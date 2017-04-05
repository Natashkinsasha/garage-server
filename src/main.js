import Promise from 'bluebird';;
const config = require('config');
import HttpServer from './server/http-server';
import WorkerService from './service/WorkerService';
import WorkerRouter from './routers/WorkerRouter';
import EquipmentService from './service/WorkerService';
import EquipmentRouter from './routers/WorkerRouter';
import app from './server/app';
const httpServer = new HttpServer(app);
const MongoClient =Promise.promisifyAll(require('mongodb')).MongoClient;
const url = `mongodb://${config.get('mongoDb.user')}:${config.get('mongoDb.password')}${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;

new Promise(function(resolve, reject) {
    MongoClient.connect(url).then(resolve, reject)
}).then((db) => (
    [new WorkerService(db), new EquipmentService(db)]
)).spread((workerService, equipmentService) => (
    [new WorkerRouter(workerService), new EquipmentRouter(equipmentService)]
)).spread((workerRouter, equipmentRouter) => {
    app.use('/worker', workerRouter);
    app.use('/equipment', equipmentRouter);
}).then(()=>{
    httpServer.start(config.get('server.port'));
}).catch((err)=>{
    console.log(err);
    httpServer.finish();
});

