export {};
import fs = require('fs');
import path = require('path');

exports.setRoutes = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, '../projects'), function (readErr, items) {
            var R = '',
                U = '';
            for (var i = 0; i < items.length; i++) {
                R += `const ${items[i]}Route = require('../projects/${items[i]}/routing');\n`;
                U += `app.use('/api', ${items[i]}Route);\n`;
            }
            const fullFile = `${R}module.exports = function (app) {\n${U}};\n`;

            fs.writeFile(path.join(__dirname, 'routing.js'), fullFile, function (writeErr) {
                if (writeErr) {
                    reject(writeErr);
                }
                resolve();
            });
        });
    });
};
