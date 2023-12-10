//setup invalid option, will be replaced upon config file load
var artnetOptions = {
	host: '192.0.2.0',
	port: 10023,
	sendAll: true
};

//project files
const fixtures = require('./src/fixtures');
const wsServer = require('./src/wsServer');

//npm modules
const artnet = require('artnet')(artnetOptions);

//basic modules
const path = require('path');
const fs = require('fs');
const os = require('os');

//electron setup
const { app, BrowserWindow, screen } = require('electron');
if (require('electron-squirrel-startup')) app.quit();

//data setup
const dataDir = app.getPath('userData');
const configDir = path.join(dataDir, 'config');

if (!fs.existsSync(configDir)) {
	fs.mkdirSync(configDir, { recursive: true });
}

//path for each file
let configFiles = {
	'config/profiles.json': 'profiles.json',
	'config/fixtures.json': 'fixtures.json',
	"config/artnet.json": 'artnet.json',
	"LICENSE.txt": 'LICENSE.txt'
};

let configKeys = Object.keys(configFiles);
for (i = 0; i < configKeys.length; i++) {
	let key = configKeys[i];
	let filePath = path.join(configDir, configFiles[key]);

	if (!fs.existsSync(filePath)) {
		fs.copyFileSync(
			path.join(__dirname, key), filePath);
	}
}

fixtures.loadProfiles();
fixtures.loadFixtures();
fixtures.initProgrammingColors();

var receiverState = {
	stayOpen: true,
	beginData: Array(512).fill(0),
	endData: Array(512).fill(0),
	currentData: Array(512).fill(0),
	fadeDuration: 1000,
	fadeCurve: 'linear',
	startTime: new Date()
};

wsServer.init();

function sendUniverse(senderObj, dmxData) {
	console.log('sent: ', dmxData);
	for (i in dmxData) {
		senderObj.set(1, dmxData, (err, res) => {
			console.log(err, res);
		});
	}
}

function calcFade(fadeCurve, beginData, endData, fadeDuration, timeElapsed) {
	let decimalTime = Math.min(timeElapsed / fadeDuration, 1);
	let newData = Array(512);
	let newValue;

	if (fadeDuration === 0) {
		console.log('faded instantly');
		return endData;
	}

	switch (fadeCurve) {

		case 'linear':
			for (let i = 0; i < beginData.length; i++) {
				newValue = Math.round(endData[i] * decimalTime + beginData[i] * (1 - decimalTime));
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

//handle closing
process.on('SIGINT', function () {
	console.log('\nReceived interrupt, exiting gracefully');

	artnet.close();
	socket.close();

	process.exit();
});

yieldingUpdate(receiverState);

//set artnet address
let artnetFile = path.join(app.getPath('userData'), 'config', 'artnet.json');
let artnetConfig = JSON.parse(fs.readFileSync(artnetFile, { encoding: 'utf8', 'flag': 'r' }));

//update options
artnetOptions.host = artnetConfig.host;
artnetOptions.port = artnetConfig.port;
artnet.setHost(artnetOptions.host);
artnet.setPort(artnetOptions.port);

//set icon path
let iconPath;
if (os.platform() === 'win32') {
	iconPath = './icons/icon.ico';
} else {
	iconPath = './icons/icon.png';
}

//setup create window. pageMode = <multi>
const createWindow = (pageLocation, queryData) => {
	const win = new BrowserWindow({
		width: 1,
		height: 1,
		autoHideMenuBar: true,
		fullscreen: true,
		backgroundColor: '#000',
		icon: iconPath,
	});

	win.loadFile(pageLocation, {query: queryData});
};

app.whenReady().then(() => {
	//unified, cues, design
	createWindow('./pages/index.html', {displayMode: 'cue', wsIp: 'localhost:9999'});
	createWindow('./pages/index.html', {displayMode: 'design', wsIp: 'localhost:9999'});
});