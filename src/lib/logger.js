import winston from 'winston';
import config from 'config';

const level = config.get('level');

module.exports = new (winston.Logger)({
    level: level,
    transports: [
        new (winston.transports.Console)(),
    ],
});
