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
		this.updateFadetime(appState.fadetime);
	},
	disconnect() {
		this.socket.close();
	},
	sendMsg(msg) {
		if(this.socket.readyState != 1) {
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
