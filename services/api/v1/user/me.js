module.exports = async function (f, opts) {
    f.get('/me', {
        schema: {
            tags: ["user"],
            security: [{ "Authorization": [] }]
        }
    }, async (req, res) => {
        let user = req.user.toJSON();
        delete user.password;
        delete user.passwordSalt;
        res.send(user)
    })
}
