import express from 'express';
const workerRouter = express.Router();


module.exports = (workerService) => {
    return workerRouter
        .get('/find/positions', (req, res, next) => {
            return workerService
                .findByPositions(req.body.positions)
                .then((workers) => {
                    return res.status(200).json({workers});
                })
        })
        .get('/positions', (req, res, next) => {
            return res.status(200).json({
                positions: [{key: 'driver', text: 'Водитель', value: 'driver'},
                    {key: 'machinist', text: 'Машинист', value: 'machinist'},
                    {key: 'mechanic', text: 'Механник', value: 'mechanic'},
                    {key: 'master', text: 'Мастер', value: 'master'},
                    {key: 'rigger', text: 'Стропальщик', value: 'rigger'},
                    {key: 'accountant', text: 'Бухгалтер', value: 'accountant'}
                ]
            });
        })
        .get('/:id', (req, res, next) => {
            req.checkParams({
                'id': {
                    isObjectId: {
                        errorMessage: 'Invalid id'
                    }
                }
            });
            req.getValidationResult()
                .then((result) => {
                    if (result.isEmpty()) {
                        return workerService.getById(req.params.id)
                            .then((worker) => {
                                if (worker) {
                                    return res.status(200).json(worker);
                                }
                                return res.status(204).end();
                            })
                    }
                    return res.status(400).json(result.mapped());
                })
                .catch(next);
        })
        .get('/', (req, res, next) => {
            req.checkQuery({
                'page': {
                    notEmpty: {
                        errorMessage: 'Invalid page'
                    },
                    isInt: {
                        errorMessage: 'Page is required'
                    },
                },
                'number': {
                    notEmpty: {
                        errorMessage: 'Number is required'
                    },
                    isInt: {
                        errorMessage: 'Invalid number'
                    },

                },
                'direction': {
                    optional: {
                        options: {checkFalsy: true}
                    },
                    isDirection: {
                        errorMessage: 'Invalid type direction'
                    }
                },
            });
            req.getValidationResult()
                .then((result) => {
                    if (result.isEmpty()) {
                        return workerService
                            .get({
                                page: req.query.page,
                                limit: req.query.number,
                                sort: createSortObject(req.query.sortedColumn, req.query.direction),
                            })
                            .then((workers) => (res.status(200).json(workers)))
                    }
                    return res.status(400).json(result.mapped());
                })
                .catch(next);
        })
        .post('/', (req, res, next) => {
            return workerService.save(req.body).then((worker) => (res.status(201).json(worker))).catch(next);
        })
        .put('/', (req, res, next) => {
            return workerService.update(req.body).then((UpdateCommandResult) => {
                if (UpdateCommandResult) {
                    return res.status(200).end();
                }
                return res.status(204).end();
            }).catch(next);
        })
        .delete('/', (req, res, next) => {
            req.checkBody({
                'ids': {
                    notEmpty: {
                        errorMessage: 'Id array is empty'
                    },
                    isArrayObjectId: {
                        errorMessage: 'Invalid ids'
                    }
                }
            });
            return req
                .getValidationResult()
                .then((result) => {
                    if (result.isEmpty()) {
                        return workerService
                            .remove(req.body.ids)
                            .then(() => (res.status(200).end()))
                    }
                    return res.status(400).json(result.mapped());
                })
                .catch(next);
        });

};

function createSortObject(field, direction) {
    let sort;
    if (field) {
        let course = 'ascending';
        if (direction) {
            course = direction;
        }
        sort = {[field]: course};
    }
    return sort;
}

