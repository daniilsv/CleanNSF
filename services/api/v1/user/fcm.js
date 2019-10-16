module.exports = async function (f, opts) {
    f.post('/fcm', {
        schema: {
            tags: ["user"],
            body: {
                type: 'object',
                properties: {
                    fcmToken: { type: 'string', description: "Firebase токен" },
                }
            },
            security: [{ "Authorization": [] }]
        }
    }, async (req, res) => {
        if (!req.body.fcmToken)
            return res.paymentRequired();
        req.session.fcmToken = req.body.fcmToken;
        req.session.save();
        res.send({ success: true });
    })
}
