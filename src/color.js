const { getProgrammingColor } = require('./fixtures');
const appState = require('./state')

function updateProgrammingColors() {
    let activeFixtures = appState.activeFixtures;

    for (i of activeFixtures) {
        if (appState.programmingColors[i].length == 3)
            appState.programmingColors[i] = appState.pickerColor.slice(0, 3);
        else if (appState.programmingColors[i].length == 1)
            appState.programmingColors[i] = [Math.round(appState.pickerColor[3] * (255 / 100))];
    }
}

function genCorrectedColors() {}

module.exports = {
    updateProgrammingColors: updateProgrammingColors
};