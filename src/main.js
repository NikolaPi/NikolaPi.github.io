const wsIp = 'localhost:9999';

let profileData = JSON.parse(window.electronAPI.requestData('profiles.json'));
let fixtureData = JSON.parse(window.electronAPI.requestData('fixtures.json'));

for (let i = 0; i < fixtureData.fixtures.length; i++) {
	let newFixture = fixtureData.fixtures[i];

	newFixture.type = profileData[newFixture.profile].name;
	newFixture.profile = profileData[newFixture.profile].colorCorrection;
	newFixture.programmingColor = [0, 0, 0];

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

colorPicker.on('input:change', function(color) {
	for(iString in appState.activeFixtures) {
		if(appState.activeFixtures[iString] === true) {
			let i = Number(iString);

			let fixture = appState.fixtures[i];
			let fixtureAddress = fixture.address;
			let fixtureChannels = [fixture.address, fixture.address+1, fixture.address+2];
			let rgbColor = [color.rgb.r, color.rgb.g, color.rgb.b];
			let correctedColor = correctColor(fixture.profile, rgbColor, color.value, true);

			fixture.programmingColor = correctedColor;
			let colorBlock = document.getElementById(`fixture-${i+1}-color-block`).style.backgroundColor = color.hexString;

			if(appState.liveMode) {
				socketHandler.updateFadetime(appState.pickerFadetime);
				socketHandler.updateChannels(fixtureChannels, correctedColor);
			}
		}
	}
});


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
