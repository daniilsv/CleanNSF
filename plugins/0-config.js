const fp = require("fastify-plugin");
module.exports = fp(function (fastify, opts, next) {
    fastify.decorate("config", require('rob-config').properties());
    next()
});