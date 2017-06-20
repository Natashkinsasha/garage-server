import Redis from 'ioredis';
import config from 'config';

const HOST = config.get('redis.host');
const PORT = config.get('redis.port');

export default () => new Redis(PORT, HOST);