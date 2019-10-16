module.exports = function (fastify) {
    const argv = process.argv.slice(2);
    switch (argv[0]) {
        case "sync":
            syncDatabase(fastify, argv);
            return true;
        case "rebuild-groups":
            fastify.db.Group.rebuildHierarchy();
            return true;
        case "seed":
            seedDatabase(fastify, argv);
            return true;
    }
    return false;
};

const syncDatabase = async function (fastify, argv) {
    await fastify.db.sequelize.sync({ force: argv[1] == "force" });
    log.i("end");
    process.exit(0);
}

const seedDatabase = async function (fastify, argv) {
    const fs = require('fs');
    const path = require('path');
    let files = fs
        .readdirSync(path.join(__basedir, 'seeders'))
        .filter(file => {
            const allPred = argv[1] == "all" ? true : argv.slice(1).includes(file.slice(0, -3));
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && allPred);
        });
    for (let file of files) {
        log.i(path.join(__basedir, 'seeders', file));
        const seeder = require(path.join(__basedir, 'seeders', file));
        await seeder(fastify);
    }
    process.exit(0);
}