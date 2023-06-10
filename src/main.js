var socketHandler = {
	socketAddr: '',
	msgQueue: [],

	setLocation(ip) {
		this.socketAddr = `ws://${ip}/qlcplusWS`
	},
	connect() {
		this.socket = new WebSocket(this.socketAddr);
		this.socket.onopen = function(e) {
			console.log(`socket successfully connected. ${socketHandler.msgQueue.length} messages waiting in queue`);
			console.log(socketHandler.msgQueue)
			for(i in socketHandler.msgQueue) {
				socketHandler.socket.send(socketHandler.msgQueue[i])			
			}
			socketHandler.msgQueue = [];
		}
	},
	disconnect() {
		this.socket.close(); 
	},
	updateChannel(dmxAddr, value) {
		let msgStr = `CH|${dmxAddr}|${value}`
		if(this.socket.readyState != 1) {
			this.msgQueue.push(msgStr)
		}

		else {
			console.log(`immediately sent: ${msgStr}`)
			this.socket.send(msgStr)
		}
	}
}

function onChange(color, colorPicker) {
	let id = Number(colorPicker.id);
	let addrList = panelAddr[id];
	let rgb = color.rgb;
	let rgbFactors = panelModes[id];
	//get proper color
	let correctedRgb = [Math.round(rgb.r*rgbFactors[0]), Math.round(rgb.g*rgbFactors[1]), Math.round(rgb.b*rgbFactors[2])];

	//output channels
	console.log(addrList)
	for(i=0; i<addrList.length; i++) {
		let addr = addrList[i];
		socketHandler.updateChannel(addr, correctedRgb[0]);
		socketHandler.updateChannel(addr+1, correctedRgb[1]);
		socketHandler.updateChannel(addr+2, correctedRgb[2]);
	}
}

const fixtures = configObj.fixtures;
const sections = fixtures.length;
const wsIp = configObj.wsIp;

//connect websocket
socketHandler.setLocation(wsIp);
socketHandler.connect();

//load panel names
let panelNames = [];
let panelAddr = [];
let panelModes = [];

for(i in fixtures) {
	console.log(fixtures[i].name);
	panelNames.push(fixtures[i].name);
	panelAddr.push(fixtures[i].addresses)
	panelModes.push(fixtures[i].profile)
}

//load panel data

//add containers for color pickers
let htmlChunk = '';
for(i=0; i<sections; i++) {
	let sectionTemplate = `<div id=panel-${i} class='panel-container grid-item'><h2 class='panel-name'>${panelNames[i]}</h2></div>\n`
	htmlChunk += sectionTemplate;
}
document.getElementById('grid-container').innerHTML = htmlChunk;

//add color pickers
sectionDivList = document.getElementsByClassName('panel-container')
colorPickerList = [];

for(i = 0; i<sections; i++) {
	let colorPicker = new iro.ColorPicker(sectionDivList[i], {
		borderWidth: 2,
		borderColor: '#ffffff',
		id: i
	});

	colorPicker.on('color:change', function(color) {
		onChange(color, colorPicker);
	});

	colorPicker.on('mount', function(picker) {
		onChange(picker.color, picker);
	});
	
	colorPickerList.push(colorPicker);
}
