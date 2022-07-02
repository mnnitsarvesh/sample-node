import kue from 'kue';
import config from './config';
import { db } from './models';

export var queue = kue.createQueue({
    prefix: 'redis-kue',
    redis: {
        host: config.redis.host,
        port: config.redis.port,
        auth: config.redis.password
    }
});

export default {
    init: () => {
        queue.process('', function (job, done) {
            
        });
    } 
}