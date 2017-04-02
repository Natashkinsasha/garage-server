module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
        ],

        tests: [
            'test/**/*Service.test.js'
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'mocha',

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },

        setup: function (w) {
            const mocha = w.testFramework;
            mocha.timeout(3000);
            require("babel-polyfill");
        },


        debug: true
    };
};