const appState = require('./state');

function nextCueNumber() {
    if (appState.cues.length) {
        let lastCue = appState.cues.at(-1);
        return Math.floor(lastCue.cueNumber) + 1;
    } else {
        return 1;
    }
}

function getCues() {
    return appState.cues;
}

function addCue({ colorData = appState.programmingColors, cueNumber = nextCueNumber(), nextAfter = -1, fadetime = appState.defaultCueFade, label = '' }, overwriteCue = false) {
    let newCue = {
        cueNumber: cueNumber,
        colorData: colorData,
        nextAfter: nextAfter,
        fadetime: fadetime,
        label: label
    };

    appState.cues.push(newCue);

    return appState.cues;
}

function removeCue(cueIndex) {
    appState.cues.splice(cueIndex, 1);

    return appState.cues;
}

function editCue(cueIndex, cueData, overwriteCue = false) {
    for (i in cueData) {
        appState.cues[cueIndex][i] = cueData[i];
    }

    return appState.cues;
}

function clearCues() {
    appState.cues = [];

    return appState.cues;
}

module.exports = {
    getCues: getCues,
    addCue: addCue,
    removeCue: removeCue,
    editCue: editCue,
    clearCues: clearCues
};