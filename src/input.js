function keydownHandler(e) {
	console.log(e);
	if (e.repeat) return;

	if (e.key === ' ') {
		nextCue();
	} else if (e.key === '\\') {
		previousCue();
	}
}
