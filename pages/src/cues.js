function msToTime(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;

	return String(hrs).padStart(2, '0') + 'h:' + String(mins).padStart(2, '0') + 'm:' + String(secs).padStart(2, '0') + '.' + String(ms).padStart(3, '0') + 's';
}

function refreshCueList(cues, activeCue) {
	openCategory = 'edit';
	let htmlChunk = '';

	console.log(cues);
	console.log(cues.length);

	for (let i = 0; i < cues.length; i++) {
		console.log(cues[i]);
		let cue = cues[i];

		//format time
		let nextAfterString;
		let fadetimeString;

		if (cue.nextAfter === -1) {
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
	
	document.querySelectorAll('.cue-row').forEach(e => e.remove());
	document.getElementById('cue-table').innerHTML += htmlChunk;
}

function addCue() {
	core.addCue();
}

function editCue(cueIndex, cuePropertyIndex, data) {
	switch (cuePropertyIndex) {
		//cue number
		case 0:
			prompt_popup('Cue Number (0 or empty will delete cue )', 'number', appState.cues[cueIndex].cueNumber, 0, 9999, function (results) {
				if (results[0]) {
					let cueNumber = Number(results[1]);
					if (cueNumber <= 0) {
						appState.cues.splice(cueIndex, 1);
						refreshCues('edit');
					} else {
						let cueAvailable = true;
						let requestedNumber = cueNumber;
						//check if cue number available
						for (let i = 0; i < appState.cues.length; i++) {
							if (appState.cues[i].cueNumber === requestedNumber) {
								cueAvailable = false;
								break;
							}
						}
						if (cueAvailable) {
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
			prompt_popup('Fadein Time (in seconds)', 'number', appState.cues[cueIndex].fadetime / 1000, 0, 43200, function (results) {
				console.log(results[0]);
				if (results[0]) {
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
			let nextAfterUpdate = function (results) {
				if (results[0]) {
					let nextAfter = Number(results[1]);
					if (nextAfter < 0) {
						appState.cues[cueIndex].nextAfter = -1;
					}
					else {
						appState.cues[cueIndex].nextAfter = nextAfter * 1000;
					}

					refreshCues('edit');
				}
			}
			if (appState.cues[cueIndex].nextAfter === -1) {
				prompt_popup('Next After Time (in seconds. Set to -1 to hold until manual next cue trigger)', 'number', -1, -1, 43200, nextAfterUpdate);
			} else {
				prompt_popup('Next After Time (in seconds. Set to -1 to hold until manual next cue trigger)', 'number', appState.cues[cueIndex].nextAfter / 1000, -1, 43200, nextAfterUpdate);
			}
			break;

		//label
		case 3:
			prompt_popup('Cue Label', 'text', appState.cues[cueIndex].label, 1, 0, (results) => {
				if (results[0]) {
					let newLabel = results[1];
					appState.cues[cueIndex].label = newLabel;
					refreshCues('edit');
				}
			});
			break;
	}
}

function initializeCueView(openCategory) {
	//ensure cue view doesn't start with running cue
	appState.currentCue = 1;

	//initialize headers
	let cues = appState.cues;
	let htmlChunk = `
		<tr>
			<th id='cue-header'> Cue </th>
			<th id='fadein-header'> Fade in </th>
			<th id='nextAfter-header'> Next After </th>
			<th id='label-header'> Label </th>
		</tr>`;
	
	document.getElementById('cue-table').innerHTML += htmlChunk;

	/*if (!(appState.currentCue === undefined)) {
		playCue(appState.currentCue);
	}*/

	/*
	if (openCategory === 'play') {
	console.log(cues);

		for (let i = 0; i < cues.length; i++) {
			const row = document.getElementById(`cue-row-${i}`);

			row.addEventListener('click', () => {
				playCue(i);
			});

			//spacebar
		}

		addViewListener(document, 'keydown', play_keydownHandler);
	} else if (openCategory === 'edit') {
		for (let row = 0; row < cues.length; row++) {
			//run once for each row
			for (let column = 0; column < 4; column++) {
				const elem = document.querySelector(`#cue-row-${row}>.column-${column}`);
				elem.addEventListener('click', () => {
					editCue(row, column);
				})
			}
		}
		addViewListener(document, 'keydown', edit_keydownHandler);
	}*/
}

function playCue(cueIndex) {
	//autoscroll to center cursor vertically if possible
	let cueTableElem = document.getElementById('cue-table');
	let cueTableDiv = document.getElementById('cue-table-scroller');
	let rowElems = document.querySelectorAll('#cue-table tr');

	//rowheights
	let rowHeights = [];
	let centerOffset = (cueTableDiv.clientHeight / 2);
	let maxScroll = (cueTableDiv.scrollHeight - cueTableDiv.clientHeight);
	for (let i = 0; i < rowElems.length; i++) {
		rowHeights.push(rowElems[i].offsetHeight);
	}

	cueTableDiv.scrollTop = Math.min(Math.max(0, (rowHeights.slice(0, cueIndex).reduce((a, b) => a + b, 0)) - centerOffset), maxScroll);

	let cues = appState.cues;
	let cue = appState.cues[cueIndex];
	let cueColors = cue.colorList;

	showProgramming();
	/*socketHandler.updateFadetime(cue.fadetime);

	//blatantly copied from fixtures.js
	for (let i = 0; i < appState.fixtures.length; i++) {
		let fixture = appState.fixtures[i];

		let fixtureChannels;
		if (fixture.profile.length === 3) {
			fixtureChannels = [fixture.address, fixture.address + 1, fixture.address + 2];
			socketHandler.updateChannels(fixtureChannels, cueColors[i]);
		} else if (fixture.profile.length === 1) {
			fixtureChannels = [fixture.address];
			socketHandler.updateChannels(fixtureChannels, [cueColors[i]]);
		}
	}*/
	//remove old cue active marker
	let pastCueElem = document.getElementsByClassName('active-cue')
	if (pastCueElem[0]) {
		pastCueElem[0].classList.remove('active-cue');
	}

	appState.currentCue = cueIndex;

	//setup timer to play next cue
	if (appState.currentMode === 'cue-play') {
		if (cue.nextAfter != -1) {
			appState.nextCueTimeout = setTimeout(playNextCue, cue.fadetime + cue.nextAfter);
		}
	}

	//mark cue as active in UI
	let currentCueElem = document.getElementById(`cue-row-${cueIndex}`);
	currentCueElem.classList.add('active-cue');
}

function clearCues() {
	appState.cues = [];
	appState.currentCue = undefined;

	setView(document.getElementById('main-window'), cueView)
}

function saveCues() {
	//TODO: implement server side saving
}

function refreshCues(openCategory = 'play') {
	setView(document.getElementById('main-window'), cueView);
}