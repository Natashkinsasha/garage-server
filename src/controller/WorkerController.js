

function WorkerController(workerService) {

    this.findByPositions = (req, res, next) => {
        return workerService
            .findByPositions(...req.query.positions)
            .then((workers) => {
                return res.status(200).json({workers});
            })
            .catch(next);
    };

    this.getPositions = (req, res, next) => {
        return res.status(200).json({
            positions: [{key: 'driver', text: 'Водитель', value: 'driver'},
                {key: 'machinist', text: 'Машинист', value: 'machinist'},
                {key: 'mechanic', text: 'Механник', value: 'mechanic'},
                {key: 'master', text: 'Мастер', value: 'master'},
                {key: 'rigger', text: 'Стропальщик', value: 'rigger'},
                {key: 'accountant', text: 'Бухгалтер', value: 'accountant'}
            ]
        })
    };

    this.getById = (req, res, next) => {
        return workerService.getById(req.params.id)
            .then((worker) => {
                if (worker) {
                    return res.status(200).json(worker);
                }
                return res.status(204).end();
            })
            .catch(next);
    };


    this.get = (req, res, next) => {
        return workerService
            .get({
                page: req.query.page,
                limit: req.query.number,
                sort: createSortObject(req.query.sortedColumn, req.query.direction),
            })
            .then((workers) => (res.status(200).json(workers)))
            .catch(next);
    };

    this.save = (req, res, next) => {
        return workerService
            .save(req.body)
            .then((worker) => (res.status(201).json(worker)))
            .catch(next);
    };

    this.update = (req, res, next) => {
        return workerService
            .update(req.body)
            .then((UpdateCommandResult) => {
                if (UpdateCommandResult) {
                    return res.status(200).end();
                }
                return res.status(204).end();
            })
            .catch(next);
    };

    this.remove = (req, res, next) => {
        return workerService
            .remove(...req.query.ids)
            .then(() => (res.status(200).end()))
            .catch(next);
    }
}

export default WorkerController;


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
