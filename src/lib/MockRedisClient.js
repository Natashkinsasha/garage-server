const RedisMock = require('ioredis-mock').default;

module.exports = () => new RedisMock();
