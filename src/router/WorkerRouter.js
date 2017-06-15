import express from 'express';

import ValidationError from '../error/ValidationError';

export default ({workerController, authorizationCheck = () => ((req, res, next) => (next()))}) => {
    const workerRouter = express.Router();
    return workerRouter
        .get('/find/positions', authorizationCheck(), workerController.findByPositions)
        .get('/positions', authorizationCheck(), workerController.getPositions)
        .get('/:id', authorizationCheck(), validateGetById, workerController.getById)
        .get('/', authorizationCheck(), validateGet, workerController.get)
        .post('/', authorizationCheck(), workerController.save)
        .put('/', authorizationCheck(), workerController.update)
        .delete('/', authorizationCheck(), validateDelete, workerController.remove);
};

function validateGetById(req, res, next) {
    req.checkParams({
        'id': {
            isObjectId: {
                errorMessage: 'Invalid id'
            }
        }
    });
    return req
        .getValidationResult()
        .then((result) => {
            if (result.isEmpty()) {
                return next();
            }
            throw new ValidationError(result);
        })
        .catch((err) => {
            return next(err)
        });
}

function validateGet(req, res, next) {
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
    return req.getValidationResult()
        .then((result) => {
            if (result.isEmpty()) {
                return next();
            }
            throw new ValidationError(result);
        })
        .catch(next);
}

function validateDelete(req, res, next) {
    req.checkQuery({
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
                return next();
            }
            throw new ValidationError(result);
        })
        .catch(next);
}




