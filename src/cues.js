function msToTime(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;

	return String(hrs).padStart(2, '0') + 'h:' + String(mins).padStart(2, '0') + 'm:' + String(secs).padStart(2, '0') + '.' + String(ms).padStart(3, '0') + 's';
}

function sortCues() {
	appState.cues.sort((a,b) => a.cueNumber - b.cueNumber);
}

function nextCueNumber() {
	if(appState.cues.length) {
		return Math.floor(appState.cues[appState.cues.length-1].cueNumber)+1;
	} else {
		return 1;
	}
}

function editCue(cueIndex, cuePropertyIndex, data) {
	switch(cuePropertyIndex) {
		//cue number
		case 0:
			prompt_popup('Cue Number (0 or empty will delete cue )', 'number', appState.cues[cueIndex].cueNumber, 0, 9999, function(results) {
				if(results[0])  {
					let cueNumber = Number(results[1]);
					if(cueNumber <= 0) {
						appState.cues.splice(cueIndex, 1);
						refreshCues('edit');
					} else {
						let cueAvailable = true;
						let requestedNumber = cueNumber;
						//check if cue number available
						for(let i = 0; i < appState.cues.length; i++) {
							if(appState.cues[i].cueNumber === requestedNumber) {
								cueAvailable = false;
								break;
							}
						}
						if(cueAvailable)
						{
							appState.cues[cueIndex].cueNumber = cueNumber;
							sortCues();
							refreshCues('edit');
						}
						else {
							notification_popup('Cue Number Already in Use');
						}
					}
				}
			});
			break;

		//fadein time
		case 1:
			prompt_popup('Fadein Time (in seconds)', 'number', appState.cues[cueIndex].fadetime/1000, 0, 43200, function(results) {
				console.log(results[0]);
				if(results[0]) {
					let fadetime = Number(results[1]);
					appState.cues[cueIndex].fadetime = fadetime * 1000;

					//refresh cues
					refreshCues('edit');
				}
			});
			break;

		//nextAfter time
		case 2:
			//if currently no autonext
			let nextAfterUpdate = function(results) {
				if(results[0]) {
					let nextAfter = Number(results[1]);
					if(nextAfter < 0) {
						appState.cues[cueIndex].nextAfter = -1;
					}
					else {
						appState.cues[cueIndex].nextAfter = nextAfter * 1000;
					}

					refreshCues('edit');
				}
			}
			if(appState.cues[cueIndex].nextAfter === -1) {
				prompt_popup('Next After Time (in seconds. Set to -1 to hold until manual next cue trigger)', 'number', -1, -1, 43200, nextAfterUpdate);
			} else {
				prompt_popup('Next After Time (in seconds. Set to -1 to hold until manual next cue trigger)', 'number', appState.cues[cueIndex].nextAfter/1000, -1, 43200, nextAfterUpdate);
			}
			break;

		//label
		case 3:
			prompt_popup('Cue Label', 'text', appState.cues[cueIndex].label, 1, 0, (results) => {
				if(results[0]) {
					let newLabel = results[1];
					appState.cues[cueIndex].label = newLabel;
					refreshCues('edit');
				}
			});
			break;
	}
}

function nextCue() {
	if(appState.cues.length === 0) {
		return;
	}
	if((appState.currentCue === undefined) || (appState.currentCue === appState.cues.length)) {
		playCue(0);
		return;
	}

	playCue(appState.currentCue);
}

function previousCue() {
	if(appState.cues.length === 0) {
		return;
	}
	if((appState.currentCue === undefined) || (appState.currentCue === 1)) {
		playCue(appState.cues.length-1);
		return;
	}

	playCue(appState.currentCue - 2);
}

function togglePlayMode() {
	console.log('toggling play mode');
	let toggleButton = document.getElementById('play-toggle-icon');
	if(appState.currentMode === 'cue-view') {
		appState.currentMode = 'cue-play'
		toggleButton.innerHTML = 'pause';
	} else {
		appState.currentMode = 'cue-view';
		toggleButton.innerHTML = 'play_arrow';
		if(appState.nextCueTimeout) {
			clearTimeout(appState.nextCueTimeout);
		}
	}

	if(!(appState.currentCue === undefined)) {
		playCue(appState.currentCue-1);
	} else {
		playCue(0);
	}
}

function addCue() {
	notification_popup('added cue');

	console.log('added cue');
	//new add cue system
	let fixtures = appState.fixtures;

	let newCue = {
		colorList: [],
		cueNumber: nextCueNumber(),
		nextAfter: -1,
		fadetime: appState.defaultCueFade,
		label: ''
	};

	for(let i = 0; i < fixtures.length; i++) {
		newCue.colorList.push(fixtures[i].programmingColor);
	}

	appState.cues.push(newCue);
}

function replaceCue() {
}

function initializeCueView(openCategory) {
	if(openCategory === 'edit') {
		appState.currentCue = undefined;
	}
	let cues = appState.cues;
	let htmlChunk = `
		<tr>
			<th id='cue-header'> Cue </th>
			<th id='fadein-header'> Fade in </th>
			<th id='nextAfter-header'> Next After </th>
			<th id='label-header'> Label </th>
		</tr>`;

	for(let i = 0; i < cues.length; i++) {
		let cue = cues[i];

		//format time
		let nextAfterString;
		let fadetimeString;

		if(cue.nextAfter === -1) {
			nextAfterString = 'MANUAL TRIGGER';
		} else {
			nextAfterString = msToTime(cue.nextAfter);
		}

		fadetimeString = msToTime(cue.fadetime);

		let cueListingTemplate = `<tr id='cue-row-${i}' class='cue-row ${openCategory}-view'>
			<td class='column-0'>${cue.cueNumber}</td>
			<td class='column-1'>${fadetimeString}</td>
			<td class='column-2'>${nextAfterString}</td>
			<td class='column-3'>${cue.label}</td></tr>`;
		htmlChunk += cueListingTemplate;
	}

	document.getElementById('cue-table').innerHTML = htmlChunk;

	if(!(appState.currentCue === undefined)) {
			playCue(appState.currentCue-1);
	}

	if(openCategory === 'play') {

		for(let i = 0; i < cues.length; i++) {
			const row = document.getElementById(`cue-row-${i}`);

			row.addEventListener('click', () => {
					playCue(i);
			});
		}
	} else if (openCategory === 'edit') {
		for(let row = 0; row < cues.length; row++) {
			//run once for each row
			for( let column = 0; column < 4; column++) {
				const elem = document.querySelector(`#cue-row-${row}>.column-${column}`);
				elem.addEventListener('click', () => {
					editCue(row, column);
				})
			}
		}
	}
}

function viewCues(viewMode = 'play') {
	//store current main state
	let mainWindow = document.getElementById('main-window');
	appState.mainHTML = mainWindow.innerHTML;

	//change to cue display mode
	let cueListTemplate = `<div id='cue-control-grid'><div id='cue-control-bar'>
		<button class='cue-control-button cue-navigation' onclick='previousCue()'> <span class='material-icons cue-control-label'>navigate_before </span></button>
		<button class='cue-control-button cue-navigation' onclick='nextCue()'> <span class='material-icons cue-control-label'>navigate_next </span></button>
		<button class='cue-control-button cue-navigation' onclick='togglePlayMode()'> <span id='play-toggle-icon' class='material-icons cue-control-label'>play_arrow </span></button>
		<button class='cue-control-button' onclick='clearCues()'> <span class='material-icons cue-control-label'>clear_all</span></button>
		<button class='cue-control-button' onclick='saveCues()'> <span class='material-icons cue-control-label'>save</span></button>
		<input id='cue-import-elem' type='file' accept='.lxcues' name='import'>
		<button class='cue-control-button' onclick='userHide()'> <span class='material-icons cue-control-label'>close</span></button>
	</div><div id='cue-table-scroller'><table id='cue-table'></table></div></div>`;
	//initialize view
	mainWindow.innerHTML = cueListTemplate;

	if(viewMode === 'edit') {
		//disable navigation in edit mode
		let navElements = document.getElementsByClassName('cue-navigation');
		for(let i = 0; i < navElements.length; i++) {
			navElements[i].disabled = true;
		}
	}

	//add listener to input
	let inputElem = document.getElementById('cue-import-elem');
	inputElem.addEventListener('change', function(e) {
		if (e.target.files[0]) {
			let lxFile = e.target.files[0];

			let reader = new FileReader(lxFile);
			console.log('created file reader');
			console.log(reader)
			reader.onload = function(event) {
				cuesObj = JSON.parse(event.target.result);
				console.log(cuesObj);
				appState.cues = cuesObj;
				refreshCues();

			}
			reader.readAsText(lxFile);
		}
	});
	appState.currentMode = 'cue-view';
	initializeCueView(viewMode);
}

function hideCues() {
	let mainWindow = document.getElementById('main-window');
	//recover color picker state
	mainWindow.innerHTML = appState.mainHTML;
	document.getElementById('picker-container').innerHTML = '';

	//TODO: remove duplication of original code for color picker
	colorPicker = new iro.ColorPicker('#picker-container', {
		width: pickerWidth-40,
	});

	colorPicker.on('input:change', onPickerChange);

	if(appState.nextCueTimeout) {
		clearTimeout(appState.nextCueTimeout);
	}

	appState.currentMode = 'main';
}

function playCue(cueIndex) {
	console.log(`play cue ${cueIndex+1}`);
	let cues = appState.cues;
	let cue = appState.cues[cueIndex];
	let cueColors = cue.colorList;

	socketHandler.updateFadetime(cue.fadetime);

	//blatantly copied from fixtures.js
	for(let i = 0; i < appState.fixtures.length; i++) {
		let fixture = appState.fixtures[i];

		let fixtureChannels;
		if(fixture.profile.length === 3) {
			console.log('fixture channel length = 3');
			fixtureChannels = [fixture.address, fixture.address+1, fixture.address+2];
			socketHandler.updateChannels(fixtureChannels, cueColors[i]);
		} else if(fixture.profile.length === 1) {
			fixtureChannels = [fixture.address];
			socketHandler.updateChannels(fixtureChannels, [cueColors[i]]);
		}
	}
	

	//remove old cue active marker
	let pastCueElem = document.getElementsByClassName('active-cue')
	if(pastCueElem[0]) {
		pastCueElem[0].classList.remove('active-cue');
	}

	appState.currentCue = cueIndex+1;

	//setup timer to play next cue
	if(appState.currentMode === 'cue-play') {
		console.log(cue.nextAfter);
		if (cue.nextAfter != -1) {
			appState.nextCueTimeout = setTimeout(nextCue, cue.fadetime + cue.nextAfter);
		}
	}

	//mark cue as active in UI
	let currentCueElem = document.getElementById(`cue-row-${cueIndex}`);
	currentCueElem.classList.add('active-cue');
}

function clearCues() {
	appState.cues = [];
	appState.currentCue = undefined;

	hideCues();
	showProgramming();
}

function saveCues() {
	cueString = JSON.stringify(appState.cues);
	console.log(cueString);

	const file = new File([cueString], `${(Math.random() + 1).toString(36).substring(7)}.lxcues`, {
		type: 'text/plain',
	});

	const link = document.createElement('a');
	const url = URL.createObjectURL(file);

	link.href = url;
	link.download = file.name;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	window.URL.revokeObjectURL(url)
}

function refreshCues(openCategory = 'play') {
	hideCues();
	viewCues(openCategory);
}

function userHide() {
	hideCues();
	if(appState.liveMode) {
		showProgramming();
	}
}
