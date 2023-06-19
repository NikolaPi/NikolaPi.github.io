function onPickerChange(color) {
	for(iString in appState.activeFixtures) {
		if(appState.activeFixtures[iString] === true) {
			let i = Number(iString);

			let fixture = appState.fixtures[i];
			let fixtureAddress = fixture.address;
			let fixtureChannels;
			if (fixture.profile.length === 3) {
				fixtureChannels = [fixture.address, fixture.address+1, fixture.address+2];
			} else if (fixture.profile.length === 1) {
				fixtureChannels = [fixture.address]
			}
			let rgbColor = [color.rgb.r, color.rgb.g, color.rgb.b];

			if (fixture.profile.length === 3) {
				let correctedColor = correctColor(fixture.profile, rgbColor, color.value, true);

				fixture.programmingColor = correctedColor;
				let colorBlock = document.getElementById(`fixture-${i+1}-color-block`).style.backgroundColor = color.hexString;

				if(appState.liveMode) {
					socketHandler.updateFadetime(appState.pickerFadetime);
					socketHandler.updateChannels(fixtureChannels, correctedColor);
				}
			} else if (fixture.profile.length === 1) {
				fixture.programmingColor = color.value;
				//TODO: color block later
				let dmxValue = Math.round(color.value * (255/100));
				let colorBlock = document.getElementById(`fixture-${i+1}-color-block`).style.backgroundColor = `rgb(${dmxValue},${dmxValue},${dmxValue}`;

				if(appState.liveMode) {
					socketHandler.updateFadetime(appState.pickerFadetime);
					socketHandler.updateChannels(fixtureChannels, [dmxValue]);
				}
			}
		}
	}
}
