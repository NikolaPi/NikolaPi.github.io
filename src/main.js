const wsIp = 'localhost:9999';

let profileData = JSON.parse(window.electronAPI.requestData('profiles.json'));
let fixtureData = JSON.parse(window.electronAPI.requestData('fixtures.json'));

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
