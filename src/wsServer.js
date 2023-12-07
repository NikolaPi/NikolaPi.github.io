const appState = require('./state');

const fixtures = require('./fixtures');
const cues = require('./cues');
const color = require('./color');

const { WebSocketServer } = require('ws');

function init() {
    wss = new WebSocketServer({ port: 9999 });
    wss.on('connection', function connection(ws) {
        appState.ws = ws;
        ws.on('error', console.error);
        ws.on('message', msgHandler)
    });
}

function sendMsg(msg) {
    const jsonEncoded = JSON.stringify(msg);
    appState.ws.send(jsonEncoded);
}

function msgHandler(msg) {
    let msgContent = JSON.parse(msg);
    console.log("Received msg: ", msgContent);
    let response = {};

    switch (msgContent.method) {
        //data requests
        case 'getFixtures':
            response.type = 'fixtures';
            response.data = fixtures.getFixtures();
            break;
        case 'getCues':
            let cuelistDisplayData = [];

            for (i in appState.cues) {
                let { colorData, ...displayData } = appState.cues[i];
                cuelistDisplayData.push(displayData);
            }

            response.type = 'cues';
            response.data = {
                cues: cuelistDisplayData,
                currentCue: appState.currentCue,
            };
            break;
        case 'getProgrammingColors':
            response.type = 'programmingColors';
            response.data = fixtures.getProgrammingColors(true);
            break;

        //design update requests
        case 'setActiveFixtures':
            appState.activeFixtures = new Set(msgContent.data);

            response.type = false;
            break;
        case 'pickerColor':
            appState.pickerColor = msgContent.data;
            color.updateProgrammingColors();

            response.type = 'programmingColors';
            response.data = fixtures.getProgrammingColors(false);
            break;
        
        //cue update requests
        case 'addCue':
            cues.addCue({}, msgContent.data);
            break;
        case 'removeCue':
            break;
        case 'editCue':
            break;
        case 'clearCues':
            break;
    }

    console.log("Response: ", response);

    //send response
    if (response.type) {
        sendMsg(response);
        //wsServer.sendMsg(response);
    }
}

module.exports = {
    init: init,
    sendMsg: sendMsg
};
