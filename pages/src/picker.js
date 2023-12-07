function onPickerChange(color) {
	core.updatePickerColor([color.red, color.green, color.blue, color.hsv.v]);
}
