//connect to nodejs application backend
const queryParams = (new URL(document.location)).searchParams;
const displayMode = queryParams.get('displayMode');

let wsAddr = queryParams.get('wsIp');

if (displayMode == 'unified' || displayMode == 'design') {
    wsAddr += '/?clientType=design';
} else {
    wsAddr += '/?clientType=cue';
}

//connect to application server
socketHandler.setLocation(wsAddr);
socketHandler.connect();

const mainWindow = document.getElementById('main-window');

//display proper mode
if (displayMode == 'unified' || displayMode == 'design') {
    setView(mainWindow, designView);
    core.getFixtures();
    core.getProgrammingColors();
}
else {
    setView(mainWindow, cueView);
}

//avoid keyboard focus
disableKeyboardPush('.main-control, .fixture-control');

//default to picker fadetime
socketHandler.updateFadetime(appState.pickerFadetime);