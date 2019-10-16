module.exports = async (f, opts) => {
    f.setNotFoundHandler(async (req, res) => {
        res.sendFile("index.html");
    });
}
