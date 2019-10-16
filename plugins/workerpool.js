const fp = require("fastify-plugin");
var workerpool = require('workerpool');
module.exports = fp(function (fastify, opts, next) {
    if (!opts.worker)
        fastify.decorate("worker", workerpool.pool(__basedir + '/worker.js'));
    else {
        let workerMethods = {};
        fastify.decorate("worker", {
            addMethod: (key, method) => workerMethods[key] = method,
            workerMethods: workerMethods,
        });
    }
    next()
});
