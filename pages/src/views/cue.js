function cueView(viewMode = 'play') {
    const viewId = 'cue-view';

	//change to cue display mode
	const mainWindow = document.getElementById('main-window');
	const cueListTemplate = document.getElementById('cue-view');
	const cloned = cueListTemplate.content.cloneNode(true);

	deleteView(mainWindow);
	mainWindow.append(cloned);

    appState.viewData.autoplay = false;

    addViewListener(document, 'keyup', play_keydownHandler);

	initializeCueView(viewMode);
	core.getCues();

	//TODO: reconfigure for architecture update
	disableKeyboardPush('.cue-control-button, #cue-import-elem');

	appState.currentMode = viewId;
}