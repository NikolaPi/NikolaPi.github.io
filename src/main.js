const wsIp = 'localhost:9999';

//get csv files
let profileCSV = Papa.parse(window.electronAPI.requestData('profiles.csv'), {skipEmptyLines: 'greedy'});
let fixtureCSV = Papa.parse(window.electronAPI.requestData('fixtures.csv'), {skipEmptyLines: 'greedy'});

//generate profile json object
let profileData = {};
for(let i = 0; i < profileCSV.data.length - 1; i++) {
	let csvRow = profileCSV.data[i+1];

	profileData[csvRow[0]] = {};
	profileData[csvRow[0]].name = csvRow[1];
	if(csvRow[1].toLowerCase() !== "dimmer") {
		profileData[csvRow[0]].colorCorrection = [Number(csvRow[2]), Number(csvRow[3]), Number(csvRow[4])];
	} else {
		profileData[csvRow[0]].colorCorrection = [Number(csvRow[2])];
	}
}

//generate fixture csv object
let fixtureData = {}
fixtureData.fixtures = [];
for(let i = 0; i < fixtureCSV.data.length - 1; i++) {
	let csvRow = fixtureCSV.data[i+1];

	let newFixture = {
		label: csvRow[2],
		profile: csvRow[1],
		address: Number(csvRow[0])
	};
	fixtureData.fixtures.push(newFixture);
}

integratePatchData(profileData, fixtureData);

//connect to external DMX handler
socketHandler.setLocation(wsIp);
socketHandler.connect();

//add color picker
let pickerContainer = document.getElementById('picker-center');
let pickerWidth = Math.min(pickerContainer.offsetHeight, pickerContainer.offsetWidth);
let colorPicker = new iro.ColorPicker('#picker-container', {
	width: pickerWidth-40,
});

colorPicker.on('color:change', onPickerChange);


//add fixture list
replaceFixtures(appState.fixtures);

//default to picker fadetime
socketHandler.updateFadetime(appState.pickerFadetime);
//keyboard shortcuts
document.addEventListener('keyup', main_keydownHandler);
document.addEventListener('keydown', color_keydownHandler);
