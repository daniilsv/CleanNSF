module.exports = async function (f, opts) {
    const rp = require("request-promise-native");
    f.post('/proxy', {
        schema: {
            tags: ["public-auth"],
            hide: "true"
        }
    }, async (req, res) => {
        const data = await rp({
            method: req.body.method,
            uri: req.body.url,
            body: req.body.body,
            json: true
        });
        res.send(data);
    });
}
