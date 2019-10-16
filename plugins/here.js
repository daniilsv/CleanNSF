const fp = require("fastify-plugin");
const rp = require("request-promise-native");
module.exports = fp(function (fastify, opts, next) {
    try {
        const geocoder = require("node-geocoder")({
            formatter: null,
            provider: "here",
            appId: fastify.config.here_app_id,
            appCode: fastify.config.here_app_code
        });
        fastify.decorate("here", {
            geocode: (place) => geocode(geocoder, place),
            reverse: (latitude, longitude) => reverse(geocoder, latitude, longitude),
            route: (from, to, mode) => route(fastify.config, from, to, mode),
        });
    } catch (e) { console.error(e); }
    next()
});

async function geocode(geocoder, place) {
    try {
        return (await geocoder.geocode(place))[0];
    } catch (e) {
        console.log(e);
        return null;
    }
}
async function reverse(geocoder, latitude, longitude) {
    try {
        return (await geocoder.reverse({ lat: latitude, lon: longitude }))[0];
    } catch (e) {
        console.log(e);
        return null;
    }
}
async function route(config, from, to, mode) {
    try {
        const url = "https://route.api.here.com/routing/7.2/calculateroute.json" +
            "?app_id=" + config.here_app_id +
            "&app_code=" + config.here_app_code +
            "&language=ru-ru" +
            "&representation=display" +
            `&waypoint0=geo!${from[0]},${from[1]}&waypoint1=geo!${to[0]},${to[1]}` +
            "&mode=fastest;" + mode;
        let res = await rp.get(url, {
            method: "get",
            json: true
        });
        log.i(JSON.stringify(res.response.route[0], null, "    "));
        return res.response.route[0].shape.map(_ => {
            let t = _.split(",");
            return { latitude: parseFloat(t[0]), longitude: parseFloat(t[1]) };
        });
    } catch (e) {
        console.log(e);
        return null;
    }
}
