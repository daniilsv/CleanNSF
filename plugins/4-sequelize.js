const fp = require("fastify-plugin");

module.exports = fp(function (fastify, opts, next) {
    fastify.decorate('db', require("../models"));
    next();
});