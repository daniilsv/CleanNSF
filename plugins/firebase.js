const fp = require("fastify-plugin");
module.exports = fp(function (fastify, opts, next) {
    try {
        let _fcm = new require('fcm-notification')(process.env.GOOGLE_FIREBASE_CREDENTIALS);
        fastify.decorate("firebase", _fcm);
    } catch (e) { console.error(e); }
    next()
});
