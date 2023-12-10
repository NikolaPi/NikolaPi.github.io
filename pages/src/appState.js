var appState = {
	//popups
	currentPopup: undefined,
	defaultCueFade: 2000,

	currentCue: undefined, 

	//main, cue-view
	currentMode: '',

	fixtures: {},

	activeFixtures: new Set(),
	
	container: document.getElementById('main-window'),

	viewListeners: [],
	viewData: {},
};