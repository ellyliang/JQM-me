var path = require('path');
var config = {
    entry: [path.resolve(__dirname, 'index.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: []
    }
};

module.exports = config;