var appState = {
	cues: [],

	//popups
	currentPopup: undefined,
	//defaults
	defaultCueFade: 2000,

	//cue data
	currentCue: undefined, 
	nextCueTimeout: undefined,

	//main, cue-view, cue-play, or cue-edit
	currentMode: 'main',

	//show changes in realtime?
	liveMode: true,

	fixtures: [],

	activeFixtures: {},

	//TODO: move to redrawing views where necessary
	mainHTML: '',

	viewListeners: [],

	//output state
	pickerFadetime: 1,
	cueFadetime: 2000,
	outputColors: [],

	//config version info
	fileversion_major: 1,
	fileversion_minor: 0,
};
