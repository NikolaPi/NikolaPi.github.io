function enableOpacity() {
	opacityElem = document.getElementById('opacity');
	opacityElem.style.display = 'block';
}

function disableOpacity() {
	opacityElem = document.getElementById('opacity');
	opacityElem.style.display = 'none';
}

function showPopup() {
	enableOpacity();

	const popupElem = document.getElementById('popup-box');
	popupElem.style.display = 'block';
}

function hidePopup() {
	disableOpacity();

	const popupElem = document.getElementById('popup-box');
	popupElem.style.display = 'none';
}

function alert_popup(alertText) {
	const popupContainer = document.getElementById('popup-box');

	let htmlTemplate = `
	<div id='alert-container'>
		<div id='alert-text'>${alertText}</div>
		<div id='alert-buttons'>
			<button id='alert-ok-button'> OK </button>
		</div>
	</div>
	`;

	showPopup();
	popupContainer.innerHTML = htmlTemplate;

	let okButton = document.getElementById('alert-ok-button');
	okButton.onclick = hidePopup();
}

/*
 *  0: cancel
 *  1: confirm
 */
function confirm_popup(confirmationText, callback) {
	const popupContainer = document.getElementById('popup-box');

	let htmlTemplate = `
	<div id='confirmation-container'>
		<div id='confirmation-text'>${confirmationText}</div>
		<div id='confirmation-buttons'>
			<button id='confirmation-cancel-button'> Cancel </button>
			<button id='confirmation-confirm-button'> Confirm </button>
		</div>
	</div>
	`;

	showPopup();
	popupContainer.innerHTML = htmlTemplate;

	document.getElementById('confirmation-cancel-button').onclick = function() {
		callback(0);
		hidePopup();
	}
	document.getElementById('confirmation-confirm-button').onclick = function() {
		callback(1);
		hidePopup();
	}
}

/* returns array of form [returnCode, inputContent]
 * returnCode 0: cancel
 * returnCode 1: confirm
 */
function prompt_popup(promptText, inputType = 'text', inputValue = undefined, min = 0, max = 99999999, callback) {
	const popupContainer = document.getElementById('popup-box');
	let htmlTemplate = `
	<div id='prompt-container'>
		<div id='prompt-text'>${promptText}</div>
		<input id='prompt-input' type='${inputType}' value='${inputValue}' min='${min}' max='${max}'>
		<div id='prompt-buttons'>
			<button id='prompt-cancel-button'> Cancel </button>
			<button id='prompt-confirm-button'> Confirm </button>
		</div>
	</div>
	`;

	showPopup()
	popupContainer.innerHTML = htmlTemplate;

	//setup input
	let inputElement = document.getElementById('prompt-input');
	document.getElementById('prompt-cancel-button').onclick = function() {
		let outputArray = [0, inputElement.value]
		callback(outputArray);
		hidePopup();
	}

	document.getElementById('prompt-confirm-button').onclick = function() {
		let outputArray = [1, inputElement.value]
		callback(outputArray);
		hidePopup();
	}
}

function notification_popup(notificationText) {
	let headerElem = document.getElementById('header');
	let notificationTextElem = document.getElementById('notification-text');
	notificationTextElem.text = notificationText;

	headerElem.style.animationName = 'none';

	requestAnimationFrame(() => {
		setTimeout(() => {
			headerElem.style.animationName = 'fadeout'
		}, 0);
	});
}
