const artnetOptions = {
	host: '127.0.0.1',
	sendAll: true
};

const { WebSocketServer } = require('ws');
const artnet = require('artnet')(artnetOptions);
const exec = require('child_process');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

var receiverState = {
	stayOpen: true,
	beginData: Array(512).fill(0),
	endData: Array(512).fill(0),
	currentData: Array(512).fill(0),
	fadeDuration: 1000,
	fadeCurve: 'linear',
	startTime: new Date()
};

function sendUniverse(senderObj, dmxData) {
	console.log('sent: ', dmxData);
	for(i in dmxData) {
		senderObj.set(1, dmxData, (err, res) => {
			console.log(err, res);
		});
	}
}

function calcFade(fadeCurve, beginData, endData, fadeDuration, timeElapsed) {
	let decimalTime = Math.min(timeElapsed/fadeDuration, 1);
	let newData = Array(512);
	let newValue;

	if (fadeDuration === 0) {
		console.log('faded instantly');
		return endData;
	}

	switch(fadeCurve) {

		case 'linear':
			for(let i = 0; i<beginData.length; i++) {
				newValue = Math.round(endData[i]*decimalTime + beginData[i]*(1-decimalTime));
				newData[i] = newValue;
			}
			return newData;
			break;
	}
}

function yieldingUpdate(receiverState) {

	if (receiverState.stayOpen) {

		if (!(receiverState.currentData.toString() === receiverState.endData.toString())) {
			console.log('running animation');
			receiverState.timeElapsed = new Date() - receiverState.startTime;
			let newData = calcFade(receiverState.fadeCurve, receiverState.beginData, receiverState.endData, receiverState.fadeDuration, receiverState.timeElapsed);

			//update state, TODO: update DMX
			receiverState.currentData = newData;
			sendUniverse(artnet, receiverState.currentData);
		}
		setTimeout(yieldingUpdate, 0, receiverState);
	}
}

//start socket
const socket = new WebSocketServer({ port: 9999 });

socket.on('connection', function connection(ws) {
	console.log('CONNECTION ESTABLISHED')
	ws.on('error', console.error);

	ws.on('message', function message(data) {
		let msg = data.toString('utf8').split('|');

		let prefix = msg[0]

		switch(prefix) {
			case 'CH':
				if(msg.length >= 3 && Number.isInteger(Number(msg[1])) && 1<=Number(msg[1])<=512 && 0 <= Number(msg[2]) <= 255 && Number.isInteger(Number(msg[2]))) {
					console.log(data.toString('utf8'));
					let dmxChannel = Number(msg[1])
					let dmxValue = Number(msg[2])

					//shift current data to beginning of fade
					receiverState.beginData = receiverState.currentData;

					//edit end result to encompass new data
					let newData = receiverState.endData;
					newData[dmxChannel-1] = dmxValue;
					receiverState.endData = newData;

					receiverState.startTime = new Date();
					console.log('begin : ', receiverState.beginData);
					console.log('finish: ', receiverState.endData);
					console.log('fadeDr: ', receiverState.fadeDuration);
				}
				break;

			case 'FD':
				console.log('Fade Duration Changed');
				if(msg.length >= 2 && Number.isInteger(Number(msg[1])) && Number(msg[1]) >= 0) {

					let newDuration = Number(msg[1]);
					receiverState.fadeDuration = newDuration;

					console.log(`Fade Duration Now ${newDuration}ms`);
				}
				break;
		}
	});
});

//handle closing
process.on('SIGINT', function() {
	console.log('\nReceived interrupt, exiting gracefully');

	artnet.close();
	socket.close();

	process.exit();
});

yieldingUpdate(receiverState);


/*
 *
 * ELECTRON SETUP
 *
 *
*/

//ipc call for data files
function handleDataRequest (event, dataName) {
	console.log(`received data request for ${dataName}`);
	if(dataName.includes('/') || dataName.includes('\\')) {
		console.log('declined data request, contained potentially dangerous character');
	}

	let dataFile = fs.readFileSync(path.join(os.homedir(), '.config/glimmer', dataName), {encoding: 'utf8', 'flag': 'r'});
	event.returnValue = dataFile;
	console.log(event.returnValue);
}

//setup create window
const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 800,
		autoHideMenuBar: true,
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadFile('index.html');
};

app.whenReady().then(() => {
	ipcMain.on('request-data', handleDataRequest);
	createWindow();
});
