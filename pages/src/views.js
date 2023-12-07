function deleteView(containerDiv) {
    //clear listeners & data
    removeViewListeners();
    appState.viewData = {};

    //clear UI
    containerDiv.innerHTML = '';
}

function setView(containerDiv, viewFunction) {
    deleteView(containerDiv);
    viewFunction(containerDiv);
}

function addViewListener(eventTarget, type, listener) {
    eventTarget.addEventListener(type, listener);
}

function removeViewListeners() {
    for(i = 0; i < appState.viewListeners.length; i++) {
        const target = viewListeners[i];
        target.eventTarget.removeEventListener(target.type, target.listener);
    }
}