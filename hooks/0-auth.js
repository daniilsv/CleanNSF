const fp = require("fastify-plugin");
module.exports = fp(async function (f, opts) {
  const User = f.db.User;
  const UserSession = f.db.UserSession;
  f.addHook('onRequest', async (req, res) => {
    if (!req.req.url.includes("api"))
      return;

    if (req.req.url.includes("public"))
      return;

    if (req.req.url.includes("api-docs"))
      return;

    if (!req.headers.authorization)
      return res.unauthorized("Token is required");

    const session = await UserSession.findOne({
      where: { token: req.headers.authorization },
      include: [
        { model: User, as: "user" }
      ],
    });

    if (!session)
      return res.unauthorized("Token is invalid");

    if (f.moment().isAfter(session.expire))
      return res.unauthorized("Token is expired");

    req.session = session;
    req.user = session.user;
  });
});

