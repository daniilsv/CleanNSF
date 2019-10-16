const fastify = require('fastify')();
const workerpool = require('workerpool');

global.__basedir = __dirname;

const path = require('path');
const AutoLoad = require('fastify-autoload');

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: { worker: true }
});
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'worker'),
  options: {}
});

fastify.ready(function () {
  workerpool.worker(fastify.worker.workerMethods);
});
