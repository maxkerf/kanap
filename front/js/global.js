/**
 * Show the given message to the user via a quick notification.
 * @param {string} message - The message to communicate.
 */
function sendMessageToUser(message) {
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
	document.querySelector("#cart-link span").innerHTML = totalQuantity
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
 * Check if the quantity selected by the user is between the min and max, if not, send a message to the user and replace the value by the min or the max.
 * @param {HTMLInputElement} quantityInput - The quantity input element.
 */
function checkQuantityInput(quantityInput) {
	const min = 1;
	const max = 100;

	if (quantityInput.value < min) {
		quantityInput.value = min;
		sendMessageToUser("1 exemplaire au minimum");
	} else if (quantityInput.value > max) {
		quantityInput.value = max;
		sendMessageToUser("100 exemplaires au maximum");
	}
}
