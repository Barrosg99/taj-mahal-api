require('dotenv').config();
const jwt = require('jsonwebtoken');
const redis = require('promise-redis')();

class Redis {
  constructor() {
    this.client = null;
  }

  createInstance() {
    const createClient = redis.createClient({
      url: process.env.REDIS_URL,
    });
    createClient.on('error', (error) => {
      console.error(error);
    });
    return createClient;
  }

  getInstance() {
    if (!this.client) this.client = this.createInstance();
    return this.client;
  }

  async setSession(payload) {
    const clientInstance = this.getInstance();
    const key = jwt.sign(payload, process.env.SECRET);

    await clientInstance.set(key, JSON.stringify(payload), 'EX', process.env.SESSION_EXPIRATION);
    return key;
  }

  async getSession(key) {
    const clientInstance = this.getInstance();
    const result = await clientInstance.get(key);
    if (result) return JSON.parse(result);
    return false;
  }

  deleteSession(key) {
    const clientInstance = this.getInstance();
    return clientInstance.del(key);
  }

  async renewSession(key) {
    const clientInstance = this.getInstance();

    await clientInstance.expire(key, process.env.SESSION_EXPIRATION);
  }

  async resetRedisDB() {
    const clientInstance = this.getInstance();

    await clientInstance.flushall();
  }

  async close() {
    const clientInstance = this.getInstance();
    await clientInstance.quit();
  }
}

module.exports = new Redis();
