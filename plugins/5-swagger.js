const fp = require("fastify-plugin");
module.exports = fp(function (fastify, opts, next) {
  let models = { ...fastify.db.models };
  for (let name in models) {
    if (models[name].fSchema)
      models[name] = models[name].fSchema;
    else
      delete models[name];
  }
  fastify.register(require('fastify-swagger'), {
    routePrefix: '/api-docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: fastify.config.title,
        description: fastify.config.description,
        version: fastify.config.version,
      },
      host: fastify.config.web_host,
      schemes: [fastify.config.web_scheme],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'public-auth', description: 'Auth methods without token' },
        { name: 'user', description: 'User methods' },
        { name: 'group', description: 'Group methods' },
        { name: 'knowledge', description: 'Knowledge base methods' },
        { name: 'push', description: 'Push methods' },
      ],
      definitions: models,
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        },
      }
    }
  });
  next();
});
