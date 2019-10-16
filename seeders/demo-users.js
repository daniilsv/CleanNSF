'use strict';

module.exports = async function (f) {
    const User = f.db.User;
    const pass = f.crypto.saltPassword("testtest");
    await new User({
        id: 1,
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@test.test',
        password: pass.hash,
        passwordSalt: pass.salt,
    }).save();
};