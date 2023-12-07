function disableKeyboardPush(querySelector) {
	let elemList = document.querySelectorAll(querySelector);

	for (let i = 0; i < elemList.length; i++) {
		let elem = elemList[i];
		elem.tabIndex = -1;

		//ensure click event deselects (wraps existing calls)
		let srcFunc = elem.onclick;
		elem.onclick = function () {
			this.blur();

			if (srcFunc) {
				srcFunc();
			}
		}
	}
}

function play_keydownHandler(e) {
	/*TODO: integrate code from edit handler
	console.log(document.getElementById('popup-box').style.display);
	if (document.getElementById('popup-box').style.display != '') {
		if (document.getElementById('popup-box').style.display != 'none') return;
	} */
	if (e.repeat) {
		if (e.key === ' ') {
			e.preventDefault();
		}
		return;
	};

	switch (e.key) {
		case ' ':
			e.preventDefault();
			playRelativeCue(1);
			break;
		case 'b':
			playRelativeCue(-1);
			break;
		case 'x':
			setView(appState.container, designView);
			break;
	}
}

function main_keydownHandler(e) {
	if (e.repeat) return;

	switch (e.key) {
		case 'a':
			//(a)ll
			activateAllFixtures();
			break;
		case 'z':
			//(z)ero
			deactivateAllFixtures();
			break;
		case 'h':
			//(h)ide
			toggleLiveMode();
			break;
		case 'f':
			//(f)lush
			if (!appState.liveMode) {
				showProgramming();
			}
			break;
		case 'r':
			//(r)ecord
			addCue();
			break;
		case 'c':
			//(c)ue
			setView(appState.container, cueView);
			break;
	}
}

function color_keydownHandler(e) {
	//ensure in valid color picker mode
	if (appState.currentMode != 'main') {
		return;
	}
	switch (e.key) {
		//HUE EDITS
		case '6':
			//decrease hue
			if (colorPicker.color.hue === 0) {
				colorPicker.color.hue = 359;
			} else {
				colorPicker.color.hue = colorPicker.color.hue - 1;
			}
			break;
		case '4':
			//increase hue
			colorPicker.color.hue = (colorPicker.color.hue + 1) % 360;
			break;
		//SATURATION EDITS
		case '7':
			//decrease saturation
			colorPicker.color.saturation = Math.max(colorPicker.color.saturation - 1, 0);
			break;
		case '9':
			//increase saturation
			colorPicker.color.saturation = Math.min(colorPicker.color.saturation + 1, 100);
			break;
		//INTENSITY EDITS
		case '2':
			//decrease value
			colorPicker.color.value = Math.max(colorPicker.color.value - 1, 0);
			break;
		case '8':
			//increase value
			colorPicker.color.value = Math.min(colorPicker.color.value + 1, 100);
			break;
		//INTENSITY PRESETS
		case '1':
			//blackout
			colorPicker.color.value = 0;
			break;
		case '3':
			//full
			colorPicker.color.value = 100;
			break;
		//SATURATION PRESETS
		case '5':
			colorPicker.color.saturation = 0;
			break;
		//NUMPAD RECORD
		case '0':
			//record cue
			if (e.repeat) { return }
			addCue();
			break;
	}
}
