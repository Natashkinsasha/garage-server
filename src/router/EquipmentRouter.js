import express from 'express';

export default ({equipmentController, authorizationCheck = () => ((req, res, next) => (next()))}) => {
    const equipmentRouter = express.Router();
    return equipmentRouter
        .get('/:id', authorizationCheck(), equipmentController.getById)
        .get('/', authorizationCheck(), equipmentController.get)
        .post('/', authorizationCheck(), equipmentController.save)
        .put('/', authorizationCheck(), equipmentController.update)
        .delete('/', authorizationCheck(), equipmentController.remove);
};


