module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
        ],

        tests: [
            'test/**/*Router.test.js'
        ],

        env: {
            type: 'node',
        },

        testFramework: 'mocha',

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },

        setup: function (w) {
            require("babel-polyfill");
            const mocha = w.testFramework;
            mocha.timeout(4000);
            require("babel-polyfill");
        },

        workers: {
            recycle: true
        },

        debug: true
    };
};