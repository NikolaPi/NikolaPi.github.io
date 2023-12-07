function designView(containerDiv) {
    appState.currentMode = 'main';

    const viewTemplate = document.getElementById('design-view');
    const cloned = viewTemplate.content.cloneNode(true);
    containerDiv.appendChild(cloned);

    //initialize color picker 
    let pickerContainer = document.getElementById('picker-center');
    let pickerWidth = Math.min(pickerContainer.offsetHeight, pickerContainer.offsetWidth);
    let colorPicker = new iro.ColorPicker('#picker-container', {
        width: pickerWidth - 40,
    });

    if(Object.keys(appState.fixtures).length) {
        console.log('replacing fixtures');
        replaceFixtures();
    }

    colorPicker.on('color:change', onPickerChange);

    addViewListener(document, 'keyup', main_keydownHandler);
    addViewListener(document, 'keydown', color_keydownHandler);
}