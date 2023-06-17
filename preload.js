const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	requestData: (dataName) => ipcRenderer.sendSync('request-data', dataName)
});
