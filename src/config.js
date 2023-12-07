const fs = require('fs');
const path = require('path');

const { app } = require('electron');

function parseConfigJson(filename) {
    let fileContent = readFile(path.join('config', filename));

    return JSON.parse(fileContent);
}

function readFile(filename) {
    let dataDir = app.getPath('userData'); 
    let fileContents = fs.readFileSync(path.join(dataDir, filename), {encoding: 'utf8', 'flag': 'r'});

    return fileContents;
}

module.exports = {
    parseConfigJson: parseConfigJson
};