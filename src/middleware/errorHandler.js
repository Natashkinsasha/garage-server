import Promise from 'bluebird';

import ValidationError from '../error/ValidationError';
import AuthenticationError from '../error/AuthenticationError';
import AuthorizationError from '../error/AuthorizationError';

import logger from '../lib/logger';

module.exports = () => (err, req, res, next) => {
    return Promise
        .reject(err)
        .catch(ValidationError, (err) => {
            return res.status(400).json(err.result.mapped())
        })
        .catch(AuthorizationError, (err) => {
            return res.status(401).json(err);
        })
        .catch(AuthenticationError, (err) => {
            return res.status(401).json(err);
        })
        .catch((err) => {
            logger.error(err);
            return res.status(500).json(err);
        })
};
