function  play_keydownHandler(e) {
	if (e.repeat) return;

	switch (e.key) {
		case ' ':
			nextCue();
			break;
		case '\\':
			previousCue();
			break;
		case 'x':
			hideCues();
			break;
	}
}

function  edit_keydownHandler(e) {
	if (e.repeat) return;

	switch (e.key) {
		case 'x':
			hideCues();
			break;
	}
}


function main_keydownHandler(e) {
	if (e.repeat) return;

	switch(e.key) {
		//(a)ll fixtures
		case 'a':
			activateAllFixtures();
			break;
		//z(ero) fixtures
		case 'z':
			deactivateAllFixtures();
			break;
		//(h)ide
		case 'h':
			toggleLiveMode();
			break;
		//(f)lush
		case 'f':
			if(!appState.liveMode) {
				showProgramming();
			}
			break;
		//(r)ecord
		case 'r':
			addCue();
			break;
		//(e)dit
		case 'e':
			viewCues('edit');
			break;
		//(v)iew
		case 'v':
			viewCues('play');
			break;
	}
}
