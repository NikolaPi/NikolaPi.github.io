const appState = require('./state');

const fixtures = require('./fixtures');
const cues = require('./cues');
const color = require('./color');

const { WebSocketServer } = require('ws');

function init() {
    wss = new WebSocketServer({ port: 9999 });
    wss.on('connection', function connection(ws, req) {
        const connectionMode = new URL("http://localhost" + req.url).searchParams.get('clientType');
        console.log('connection initiated.');

        if (connectionMode == 'design') {
            appState.connections.designClients.push(ws);
            console.log('Design connection added.');
        } else if (connectionMode == 'cue') {
            appState.connections.cueClients.push(ws);
            console.log('Cue connection added.');
        }

        ws.on('error', console.error);
        ws.on('message', msgHandler)
    });
}

function sendMsg(msg, group = 'all') {
    const jsonEncoded = JSON.stringify(msg);

    if (group == 'design') {
        for (socket of appState.connections.designClients) {
            socket.send(jsonEncoded);
        }
    } else if (group == 'cue') {
        for (socket of appState.connections.cueClients) {
            socket.send(jsonEncoded);
        }
    }
}

function msgHandler(msg) {
    let msgContent = JSON.parse(msg);
    let response = {};

    switch (msgContent.method) {
        //data requests
        case 'getFixtures':
            response.type = 'fixtures';
            response.data = fixtures.getFixtures();
            break;
        case 'getCues':
            response.type = 'cues';
            response.data = {
                cues: cues.getCueTableData(),
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

            response.type = 'cues';
            response.data = {
                cues: cues.getCueTableData(),
                currentCue: appState.currentCue,
            }

            break;
        case 'removeCue':
            break;
        case 'editCue':
            break;
        case 'clearCues':
            break;
    }

    //send response
    console.log(response);
    if (response.type) {
        if (['fixtures', 'programmingColors'].includes(response.type)) {
            sendMsg(response, 'design');
        } else if (['cues'].includes(response.type)) {
            sendMsg(response, 'cue');
        }
    }
}

module.exports = {
    init: init,
    sendMsg: sendMsg
};
