import express from 'express';
const workerRouter = express.Router();


module.exports = (workerService) => {
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
        return workerService.update(req.body).then((UpdateCommandResult) => {
            if (UpdateCommandResult) {
                return res.status(200).end();
            }
            return res.status(204).end();
        }).catch(next);
    }).delete('/', (req, res, next) => {
        return workerService.remove(req.query.ids).then(() => (res.status(200).end())).catch(next);
    });

};

