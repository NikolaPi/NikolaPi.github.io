function activateFixture(fixtureKey, batchOperation = false) {
	appState.activeFixtures.add(fixtureKey);
	if (!batchOperation)
		core.updateActiveFixtures();

	let fixtureListing = document.getElementById(`fixture-${fixtureKey}`);
	console.log(`fixture-${fixtureKey}: `, fixtureListing);
	fixtureListing.classList.add('active-fixture');
}

function deactivateFixture(fixtureKey, batchOperation = false) {
	appState.activeFixtures.delete(fixtureKey);
	if (!batchOperation)
		core.updateActiveFixtures();

	let fixtureListing = document.getElementById(`fixture-${fixtureKey}`);
	fixtureListing.classList.remove('active-fixture');
}

function toggleFixtureActive(fixtureKey) {
	if (appState.activeFixtures.has(fixtureKey)) {
		deactivateFixture(fixtureKey);
	} else {
		activateFixture(fixtureKey);
	}
}

function activateAllFixtures() {
	for (i in appState.fixtures) {
		activateFixture(i, true);
	}

	core.updateActiveFixtures();
}

function deactivateAllFixtures() {
	for (i in appState.fixtures) {
		deactivateFixture(i);
	}

	core.updateActiveFixtures();
}

function correctColor(correctionProfile, rgb, colorValue, brightBoost) {
	let unbrightenedColor = [rgb[0] * correctionProfile[0], rgb[1] * correctionProfile[1], rgb[2] * correctionProfile[2]];
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

	for (let i = 0; i < unbrightenedColor.length; i++) {
		brightenedRgb[i] = Math.round(unbrightenedColor[i] * maxMultiplier * (colorValue / 100));
	}

	return brightenedRgb;
}

function showProgramming(fadetime = appState.cueFadetime) {
	core.showProgramming()
}

function enableLiveMode() {
	if (appState.currentMode != 'main') {
		return;
	}

	core.setLiveMode(true);

	document.getElementById('show-programming-control').disabled = true;

	let toggleButton = document.getElementById('toggle-live-control').classList.remove('live-disabled');
	let visibilityControlIcon = document.getElementById('visibility-control-icon');
	visibilityControlIcon.innerHTML = 'visibility_off'

	showProgramming()
}

function toggleLiveMode() {
	core.toggleLiveMode();
}

function replaceFixtures() {
	if (appState.currentMode != 'main') {
		return;
	}
	//update fixture HTML list
	let fixtureListElem = document.getElementById('fixture-list');
	let htmlChunk = '';

	let fixtureKeys = Object.keys(appState.fixtures);
	console.log(fixtureKeys);

	for (let i = 0; i < fixtureKeys.length; i++) {
		let fixtureKey = fixtureKeys[i];
		let fixture = appState.fixtures[fixtureKey];

		let fixtureDiv = `
		<a onclick='toggleFixtureActive("${fixtureKey}")' class='fixture-anchor'><div id='fixture-${fixtureKey}' class='fixture-listing'>
			<span class='fixture-listing-label'> ${fixture.label} </span><br>
			<span class='fixture-listing-preface'>Type: </span> ${fixture.type} <br>
			<span class='fixture-listing-preface'>Addr: </span>${fixture.address}
			<div class='fixture-color' id='fixture-${fixtureKey}-color-block'></div>
			</div></a>`;
		htmlChunk += fixtureDiv;
	};
	fixtureListElem.innerHTML = htmlChunk;
}

function showProgrammingColors(programmingColors) {
	for (fixtureKey in programmingColors) {
		let fixtureColors = programmingColors[fixtureKey];

		//RGB
		console.log(fixtureColors.length);
		if (fixtureColors.length == 3)
			document.getElementById(`fixture-${fixtureKey}-color-block`)
				.style.backgroundColor = `rgb(${fixtureColors[0]}, ${fixtureColors[1]}, ${fixtureColors[2]})`;

		//Greyscale
		else if (fixtureColors.length === 1) {
			document.getElementById(`fixture-${fixtureKey}-color-block`)
				.style.backgroundColor = `rgb(${fixtureColors[0]}, ${fixtureColors[0]}, ${fixtureColors[0]})`;
		}
	}
}