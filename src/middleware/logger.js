import expressWinston from 'express-winston';
import logger from '../lib/logger'

module.exports = () => expressWinston.logger({
    winstonInstance: logger,
});