module.exports = async function (f, opts) {
    const User = f.db.User;
    const UserSession = f.db.UserSession;
    f.post('/login', {
        schema: {
            tags: ["public-auth"],
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', description: "E-mail" },
                    password: { type: 'string', description: "Пароль" },
                }
            },
            response: {
                "4xx": {
                    description: 'Something wrong happend',
                    type: 'object',
                    properties: {
                        "statusCode": { type: 'integer', example: 401 },
                        "error": { type: 'string', example: "Unauthorized" },
                        "message": { type: 'string', example: "Login and password are required" }
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
        },
    }, async (req, res) => {
        if (!req.body.email || !req.body.password)
            return res.unauthorized("Login and password are required");

        let user = await User.findOne({
            where: { email: req.body.email }
        });

        if (!user)
            return res.unauthorized("User not found");

        if (f.crypto.saltString(req.body.password, user.passwordSalt).hash != user.password)
            return res.unauthorized("User not found");

        let session = new UserSession({
            userId: user.id,
            token: f.crypto.randomHexString(32),
            renewToken: f.crypto.randomHexString(32),
            expire: f.moment().add(3, "days").toDate(),
        });
        await session.save();
        session = session.toJSON();
        user = user.toJSON();
        delete user.password;
        delete user.passwordSalt;
        session.user = user;
        res.send(session);
    })
}
