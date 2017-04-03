import express from 'express';
import WorkerService from '../service/workerService'
const workerRouter = express.Router();
const config = require('config');
require("babel-polyfill");
const MongoClient = require('mongodb').MongoClient;
import Promise from 'bluebird';
const url = `mongodb://<${config.get('mongoDb.user')}>:<${config.get('mongoDb.password')}>${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.db')}`;

module.exports = () => {
    return Promise.resolve(MongoClient.connect(url).then((db) => {
        const workerService = new WorkerService(db);
        return workerRouter.get('/:id', (req, res, next) => {
            return workerService.getById(req.params.id).then((worker) => {
                if (worker) {
                    return res.status(200).json(worker);
                }
                return res.status(204).end();
            }).catch(next);
        }).get('/', (req, res, next) => {
            return workerService.get(req.query.page, req.query.number).then((workers) => (res.status(200).json(workers))).catch(next)
        }).post('/', (req, res, next) => {
            return workerService.save(req.body).then(() => (res.status(201).end())).catch(next);
        }).put('/', (req, res, next) => {
            return workerService.update(req.body).then((idUpdated) => {
                if (idUpdated) {
                    return res.status(200).end();
                }
                return res.status(204).end();
            }).catch(next);
        }).delete('/', (req, res, next) => {
            return workerService.remove(req.query.ids).then(() => (res.status(200).end())).catch(next);
        })
    })).value();
};

