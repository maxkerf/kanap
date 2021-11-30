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

	setTimeout(
		() => container.classList.replace("showMessage", "hideMessage"),
		displayDuration + durationBetween
	);

	setTimeout(
		() => container.remove(),
		displayDuration + durationBetween + undisplayDuration
	);
}

function updateCartLink(totalQuantity) {
	document.querySelector("#cart-link span").innerHTML = totalQuantity
		? ` (${totalQuantity})`
		: "";
}

function rewriteImageUrl(imageUrl, size) {
	return imageUrl.slice(0, 29) + size + "/" + imageUrl.slice(29);
}

function checkQuantityInput(quantityInput) {
	if (quantityInput.value < 1) {
		quantityInput.value = 1;
		sendMessageToUser("1 exemplaire au minimum");
	} else if (quantityInput.value > 100) {
		quantityInput.value = 100;
		sendMessageToUser("100 exemplaires au maximum");
	}
}
