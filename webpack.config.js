const path = require('path');

module.exports = {
    //entry: './modules/info.js',
    entry: {
        form: './modules/userInfo.js',
        info: './modules/info.js',
        iframe: './modules/iframe.js'
    },
    output: {
        filename: '[name].entry.js',
        path: path.join(__dirname, './public/webpack')
    },
    node: {
        fs: "empty"
    }
};
