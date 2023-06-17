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
	sendMsg(msgStr) {
		if(this.socket.readyState != 1) {
			this.msgQueue.push(msgStr);
		}

		else {
			//console.log(`immediately sent: ${msgStr}`);
			this.socket.send(msgStr);
		}
	},
	updateChannels(channels, values) {
		for(let i = 0; i< channels.length; i++) {
			let chPair = [channels[i], values[i]];
			let msgStr = `CH|${chPair[0]}|${chPair[1]}`;
			this.sendMsg(msgStr);
		}
	},
	updateFadetime(time) {
		if (time === 0) {
			time = 1;
		}
		let msgStr = `FD|${time}`;
		this.sendMsg(msgStr);
	}
}
