const fastify = require('fastify')();

global.__basedir = __dirname;

const path = require('path');
const AutoLoad = require('fastify-autoload');

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: {}
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'hooks'),
  options: {}
});

const baseServicesFolder = path.join(__dirname, 'services').replace(/\\/g, '/');
for (const folder of require("glob").sync(baseServicesFolder + "/**/"))
  fastify.register(AutoLoad, {
    dir: folder,
    options: {
      prefix: folder.replace(baseServicesFolder, '')
    }
  });

fastify.ready(function () {
  process.title = fastify.config.process;
  if (require("./runtime/argv-parse")(fastify)) return;
  fastify.swagger();
  fastify.blipp();
  fastify.redis.flushdb();
  fastify.listen({ port: fastify.config.web_port });
});