const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
    username: 'default',
    password: 'MqygYI1Klts2E7c7mJLLvPU0eMz5jjrg',
    socket: {
        host: 'redis-10459.c245.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10459
    }
});

redisClient.on('error', err => console.error('Redis Client Error', err));

const connectToRedis = async () => {
    try {
        console.log("Connecting to Redis...");
        await redisClient.connect();
        console.log("Redis Database Connected Successfully");
    } catch (err) {
        console.error("Redis Connection Error:", err);
        throw err;
    }
};

module.exports = {
    redisClient,
    connectToRedis
};