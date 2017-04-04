import Promise from 'bluebird';
const config = require('config');
import HttpServer from './http-server';
import WorkerService from './service/WorkerService';
import WorkerRouter from './routers/WorkerRouter';
import app from './app';
const httpServer = new HttpServer();
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://<${config.get('mongoDb.user')}>:<${config.get('mongoDb.password')}>${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;




MongoClient.connect(url).then((db) => (
    Promise.all([new WorkerService(db)])
)).spread((workerService) => (
    Promise.all[new WorkerRouter(workerService)]
)).spread((workerRouter) => {
    app.use('/worker', workerRouter);
}).then(()=>{
    httpServer.start(3000);
}).catch((err)=>{
    console.log(err)
    httpServer.finish();
});

