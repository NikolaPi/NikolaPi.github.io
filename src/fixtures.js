function toggleFixtureActive(fixtureIndex) {
	appState.activeFixtures[fixtureIndex] = !appState.activeFixtures[fixtureIndex];

	let fixtureListing = document.getElementById(`fixture-${fixtureIndex+1}`);
	fixtureListing.classList.toggle('active-fixture');
	console.log(`toggled fixture ${fixtureIndex+1}`);
}

function activateAllFixtures() {
	for(i in appState.activeFixtures) {
		let fixtureListing = document.getElementById(`fixture-${Number(i)+1}`);
		fixtureListing.classList.add('active-fixture');

		appState.activeFixtures[i] = true;
	}
}

function deactivateAllFixtures() {
	for(i in appState.activeFixtures) {
		let fixtureListing = document.getElementById(`fixture-${Number(i)+1}`);
		fixtureListing.classList.remove('active-fixture');

		appState.activeFixtures[i] = false;
	}
}

function correctColor(correctionProfile, rgb, colorValue, brightBoost) {
	let unbrightenedColor = [rgb[0]*correctionProfile[0], rgb[1]*correctionProfile[1], rgb[2]*correctionProfile[2]];
	if (!brightBoost) { return unbrightenedColor; }

	//add brightness if possible
	let maxComponent = Math.max(...unbrightenedColor);
	let maxMultiplier;
	if (maxComponent === 0) {
		maxMultiplier = 0;
	} else {
		maxMultiplier = 255 / maxComponent;
	}

	let brightenedRgb = Array(3);

	for(let i = 0; i < unbrightenedColor.length; i++) {
		brightenedRgb[i] = Math.round(unbrightenedColor[i] * maxMultiplier * (colorValue/100));
	}

	return brightenedRgb;
}

function showProgramming() {
	console.log('showing programming');

	socketHandler.updateFadetime(appState.cueFadetime);

	//TODO: support dimmer
	for(let i = 0; i < appState.fixtures.length; i++) {
		let fixture = appState.fixtures[i];
		let fixtureChannels;
		if(fixture.profile.length === 3) {
			fixtureChannels = [fixture.address, fixture.address+1, fixture.address+2];
		} else if (fixture.profile.length === 1) {
			fixtureChannels = [fixture.address];
		}

		if(fixture.profile.length === 3) {
			socketHandler.updateChannels(fixtureChannels, fixture.programmingColor);
		} else if (fixture.profile.length === 1) {
			socketHandler.updateChannels(fixtureChannels, [fixture.programmingColor]);
		}
	}
}

function enableLiveMode() {
	document.getElementById('show-programming-control').disabled = true;

	let toggleButton = document.getElementById('toggle-live-control').classList.remove('live-disabled');
	let visibilityControlIcon = document.getElementById('visibility-control-icon');
	visibilityControlIcon.innerHTML = 'visibility_off'

	showProgramming()

	//show all passive programming
	appState.liveMode = true;
}

function disableLiveMode() {
	console.log('disabling');
	document.getElementById('show-programming-control').disabled = false;

	let toggleButton = document.getElementById('toggle-live-control').classList.add('live-disabled');
	let visibilityControlIcon = document.getElementById('visibility-control-icon');
	visibilityControlIcon.innerHTML = 'visibility';

	appState.liveMode = false;
}


function toggleLiveMode() {
	if(appState.liveMode) {
		disableLiveMode();
	} else {
		enableLiveMode();
	}
}
