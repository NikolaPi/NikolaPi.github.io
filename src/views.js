function deleteView(containerDiv) {
    //clear UI
    containerDiv.innerHTML = '';
    //clear Listeners
}

function setView(containerDiv, viewFunction) {
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