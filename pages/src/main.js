//connect to nodejs application backend
const wsIp = 'localhost:9999';


//connect to application server
socketHandler.setLocation(wsIp);
socketHandler.connect();

const mainWindow = document.getElementById('main-window');
const displayMode = (new URL(document.location)).searchParams.get('displayMode');

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