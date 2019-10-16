module.exports = async function (f, opts) {
    const User = f.db.User;
    const UserSession = f.db.UserSession;
    f.post('/renew', {
        schema: {
            tags: ["public-auth"],
            body: {
                type: 'object',
                properties: {
                    renewToken: { type: 'string', description: "Renew token" },
                }
            },
            response: {
                "4xx": {
                    description: 'Something wrong happend',
                    type: 'object',
                    properties: {
                        "statusCode": { type: 'integer', example: 401 },
                        "error": { type: 'string', example: "Unauthorized" },
                        "message": { type: 'string', example: "Renew token is required" }
                    }
                },
                "200": {
                    "description": "The response",
                    type: "object",
                    properties: {
                        ...UserSession.fSchema.properties,
                        user: { type: "object", ...User.fSchema }
                    }
                }
            },
        }
    }, async (req, res) => {
        if (!req.body.renewToken)
            return res.unauthorized("Renew token is required");

        const session = await UserSession.findOne({
            where: { renewToken: req.body.renewToken },
            include: [
                {
                    model: User, as: "user",
                    attributes: { exclude: ["password", "passwordSalt"] }
                }
            ],
        });

        if (!session)
            return res.unauthorized("Renew token is invalid");

        session.token = f.crypto.randomHexString(32);
        session.renewToken = f.crypto.randomHexString(32);
        session.expire = f.moment().add(3, "days").toDate();
        session.save();
        res.send(session);
    });
}
