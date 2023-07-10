function  play_keydownHandler(e) {
	if (e.repeat) return;

	switch (e.key) {
		case ' ':
			nextCue();
			break;
		case 'b':
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

function color_keydownHandler(e) {
	//ensure in valid color picker mode
	if (appState.currentMode != 'main') {
		return;
	}
	switch(e.key) {
		case '6':
			//decrease hue
			if(colorPicker.color.hue === 0) {
				colorPicker.color.hue = 359;
			} else {
				colorPicker.color.hue = colorPicker.color.hue-1;
			}
			break;
		case '4':
			//increase hue
			colorPicker.color.hue = (colorPicker.color.hue+1) % 360;
			break;
		case '7':
			//decrease saturation
			colorPicker.color.saturation = Math.max(colorPicker.color.saturation-1, 0);
			break;
		case '9':
			//increase saturation
			colorPicker.color.saturation = Math.min(colorPicker.color.saturation+1, 100);
			break;
		case '2':
			//decrease value
			colorPicker.color.value = Math.max(colorPicker.color.value-1, 0);
			break;
		case '8':
			//increase value
			colorPicker.color.value = Math.min(colorPicker.color.value+1, 100);
			break;
	}
}
