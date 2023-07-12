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

//integrate profiles into fixtures
for (let i = 0; i < fixtureData.fixtures.length; i++) {
	let newFixture = fixtureData.fixtures[i];

	newFixture.type = profileData[newFixture.profile].name;
	newFixture.profile = profileData[newFixture.profile].colorCorrection;
	newFixture.programmingColor = Array(newFixture.profile.length).fill(0);

	appState.fixtures.push(newFixture);
	appState.activeFixtures[i] = false;
}

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
let fixtureListElem = document.getElementById('fixture-list');
let htmlChunk = '';
for(let i = 0; i < appState.fixtures.length; i++) {
	let fixtureDiv = `
		<a onclick='toggleFixtureActive(${i})' class='fixture-anchor'><div id='fixture-${i+1}' class='fixture-listing'>
			<span class='fixture-listing-label'> ${appState.fixtures[i].label} </span><br>
			<span class='fixture-listing-preface'>Type: </span> ${appState.fixtures[i].type} <br>
			<span class='fixture-listing-preface'>Addr: </span>${appState.fixtures[i].address}
			<div class='fixture-color' id='fixture-${i+1}-color-block'></div>
			</div></a>`;
	htmlChunk += fixtureDiv;
};
fixtureListElem.innerHTML = htmlChunk;

//default to picker fadetime
socketHandler.updateFadetime(appState.pickerFadetime);
//keyboard shortcuts
document.addEventListener('keyup', main_keydownHandler);
document.addEventListener('keydown', color_keydownHandler);
