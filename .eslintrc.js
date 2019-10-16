module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "log": "readonly",
        "__basedir": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-unused-vars": [0, {"ignore-pattern": "^_"}],
        "require-atomic-updates": [0]
    }
};