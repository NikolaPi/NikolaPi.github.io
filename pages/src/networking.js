var core = {
	requestConfig() { },

	//data requests
	getFixtures() {
		const msg = {
			method: 'getFixtures'
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	getCues() {
		const msg = {
			method: 'getCues'
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	getProgrammingColors() {
		const msg = {
			method: 'getProgrammingColors'
		};
	},

	//cue editing operations
	addCue(useProgrammingColor = true) {
		const msg = {
			method: 'addCue',
			data: useProgrammingColor
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	removeCue(cueIndex) {
		const msg = {
			method: 'removeCue',
			data: cueIndex
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	editCue(cueIndex, cueData, newColor = false) {
		const msg = {
			method: 'editCue',
			data: {
				cueIndex: cueIndex,
				cueData: cueData
			}
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	clearCues() {
	},

	//cue playback operations
	togglePlayMode() {
	},

	//design mode updates
	toggleLiveMode(liveMode) {
		const msg = {
			method: 'toggleLiveMode'
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	updatePickerColor(color) {
		const msg = {
			method: 'pickerColor',
			data: color
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	updateActiveFixtures(activeFixtures) {
		const msg = {
			method: 'setActiveFixtures',
			data: Array.from(appState.activeFixtures)
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	},
	showProgramming() {
		const msg = {
			method: 'showProgramming'
		};
		socketHandler.sendMsg(JSON.stringify(msg));
	}
};

function recvHandler(e) {
	let msgContent = JSON.parse(e.data);
	console.log(msgContent);
	switch (msgContent.type) {
		case 'fixtures':
			appState.fixtures = msgContent.data;
			replaceFixtures();
			break;
		case 'cues':
			refreshCueList(msgContent.data.cues);
			break;
		case 'programmingColors':
			showProgrammingColors(msgContent.data);
			break;
	}
}

function connectHandler(e) {
	console.log(`socket successfully connected. ${socketHandler.msgQueue.length} messages waiting in queue`);
	console.log(socketHandler.msgQueue)
	for (i in socketHandler.msgQueue) {
		socketHandler.socket.send(socketHandler.msgQueue[i])
	}
	socketHandler.msgQueue = [];
}

var socketHandler = {
	socketAddr: '',
	msgQueue: [],

	setLocation(ip) {
		this.socketAddr = `ws://${ip}`
	},
	connect() {
		this.socket = new WebSocket(this.socketAddr);

		this.socket.addEventListener("open", connectHandler);
		this.socket.addEventListener("message", recvHandler);

		this.updateFadetime(appState.fadetime);
	},
	disconnect() {
		this.socket.close();
	},
	sendMsg(msg) {
		if (this.socket.readyState != 1) {
			this.msgQueue.push(msg);
		}

		else {
			//console.log(`immediately sent: ${msgStr}`);
			this.socket.send(msg);
		}
	},
	updateChannels(channels, values) {
		let wsObj = {
			type: 'channels',
			channels: channels,
			values: values,
		};

		this.sendMsg(JSON.stringify(wsObj));
	},
	updateFadetime(time) {
		if (time === 0) {
			time = 1;
		}

		let wsObj = {
			type: 'fadetime',
			fadetime: time
		};

		this.sendMsg(JSON.stringify(wsObj));
	}
}