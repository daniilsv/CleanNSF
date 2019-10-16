const fp = require("fastify-plugin");
module.exports = fp(function (fastify, opts, next) {
    fastify.decorate("moment", require("moment"));
    next()
});
