function designView(containerDiv) {
    const viewTemplate = document.getElementById('design-view');
    const cloned = viewTemplate.content.cloneNode(true);
    containerDiv.appendChild(cloned);

    //initialize color picker 
    let pickerContainer = document.getElementById('picker-center');
    let pickerWidth = Math.min(pickerContainer.offsetHeight, pickerContainer.offsetWidth);
    let colorPicker = new iro.ColorPicker('#picker-container', {
        width: pickerWidth - 40,
    });

    colorPicker.on('color:change', onPickerChange);

    replaceFixtures(appState.fixtures);
}