/**
 * Show the given message to the user via a quick notification.
 * @param {string} message - The message to communicate.
 */
function sendMessageToUser(message) {
	// check if there is already a message
	// if there is, remove it from the DOM to display properly the other one
	const isMessage = document.querySelector("#message") ? true : false;
	if (isMessage) document.querySelector("#message").remove();

	const displayDuration = 750;
	const durationBetween = 1250;
	const undisplayDuration = 1000;

	const container = document.createElement("div");
	const content = document.createTextNode(message);

	container.appendChild(content);
	container.id = "message";
	container.classList.add("showMessage");

	document.body.appendChild(container);

	// hide the message after the display animation and an enough time of showing
	setTimeout(
		() => container.classList.replace("showMessage", "hideMessage"),
		displayDuration + durationBetween
	);

	// finally, remove the notification from the DOM after the undisplay animation
	setTimeout(
		() => container.remove(),
		displayDuration + durationBetween + undisplayDuration
	);
}

/**
 * Update the total quantity of articles in the cart displayed next to the cart link in the navigation bar.
 * @param {number} totalQuantity - Total quantity of articles in the cart.
 */
function updateCartLink(totalQuantity) {
	document.querySelector("#cart-link span").innerText = totalQuantity
		? ` (${totalQuantity})`
		: "";
}

/**
 * Rewrite the given image URL to specify the size of the image (images are stored in different directories, each one for a different image size).
 * @param {string} imageUrl - The image URL to be modified.
 * @param {string="small, medium, large"} size - The desired image size.
 * @returns {string} The image URL rewritten.
 */
function rewriteImageUrl(imageUrl, size) {
	return imageUrl.slice(0, 29) + size + "/" + imageUrl.slice(29);
}

/**
 * Check if the input is valid, if not, communicate an error message to the user next to it.
 * @param {HTMLInputElement} input - The input element.
 * @returns {boolean} Boolean true if the input field is valid, false if not.
 */
function checkInput(input) {
	const isValid = input.checkValidity();

	// if an error is detected, communicate an error message to the user
	input.nextElementSibling.innerText = !isValid ? input.validationMessage : "";

	return isValid;
}

/**
 * Check if an object is empty or not.
 * @param {Object} object - The object to check.
 * @returns {boolean} Boolean true is the object is empty, false if not.
 */
function isObjectEmpty(object) {
	return !Object.keys(object).length;
}
