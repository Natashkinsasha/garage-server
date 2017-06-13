
function EquipmentController(equipmentService) {

    function getById(req, res, next) {
        return equipmentService
            .getById(req.params.id).then((worker) => {
                if (worker) {
                    return res.status(200).json(worker);
                }
                return res.status(204).end();
            })
            .catch(next);
    }

    function get(req, res, next) {
        return equipmentService
            .get(req.query.page, req.query.number)
            .then((workers) => (res.status(200).json(workers)))
            .catch(next);
    }

    function save(req, res, next) {
        return equipmentService
            .save(req.body).then(() => (res.status(201).end()))
            .catch(next);
    }

    function update(req, res, next) {
        return equipmentService
            .update(req.body)
            .then((updateCommandResult) => {
                if (updateCommandResult) {
                    return res.status(200).end();
                }
                return res.status(204).end();
            })
            .catch(next);
    }

    function remove(req, res, next) {
        return equipmentService
            .remove(req.query.ids)
            .then(() => (res.status(200).end()))
            .catch(next);
    }
}

export default EquipmentController;

