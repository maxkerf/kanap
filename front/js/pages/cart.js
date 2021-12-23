/**
 * Create a button to empty the cart.
 * @returns {HTMLDivElement} The empty cart button.
 */
function createEmptyCartButton() {
	const button = document.createElement("div");
	button.classList.add("empty-cart-btn");
	button.innerText = "Vider le panier";

	return button;
}

/**
 * Display on the page the products stored in the cart.
 * @param {CartProduct[]} cartProducts - An array of cart products.
 * @param {ProductManager} productManager - A product manager containing an array of products.
 */
function display(cartProducts, productManager) {
	const productsContainer = document.querySelector("#cart__items");

	if (cartProducts.length) {
		productsContainer.append(createEmptyCartButton());

		cartProducts.forEach(cartProduct => {
			const productId = cartProduct.productId;
			const product = productManager.getProduct(productId);

			const productContainer = document.createElement("article");
			productContainer.classList.add("cart__item");
			productContainer.dataset.id = productId;
			productContainer.dataset.color = cartProduct.color;

			const imageContainer = document.createElement("div");
			imageContainer.classList.add("cart__item__img");
			const image = document.createElement("img");
			const imageUrl = rewriteImageUrl(product.imageUrl, "medium");
			image.src = imageUrl;
			image.alt = product.altTxt;
			imageContainer.append(image);

			const content = document.createElement("div");
			content.classList.add("cart__item__content");

			const titleAndPriceContainer = document.createElement("div");
			titleAndPriceContainer.classList.add("cart__item__content__titlePrice");
			const title = document.createElement("h2");
			title.innerText = `${product.name} ${cartProduct.color}`;
			const price = document.createElement("p");
			price.innerText = `${product.price} €`;
			titleAndPriceContainer.append(title);
			titleAndPriceContainer.append(price);

			const settings = document.createElement("div");
			settings.classList.add("cart__item__content__settings");

			const quantityContainer = document.createElement("div");
			quantityContainer.classList.add(
				"cart__item__content__settings__quantity"
			);
			const quantityLabel = document.createElement("p");
			quantityLabel.innerText = "Quantité :";
			const quantityInput = document.createElement("input");
			quantityInput.classList.add("itemQuantity");
			quantityInput.type = "number";
			quantityInput.name = "itemQuantity";
			quantityInput.min = "1";
			quantityInput.max = "100";
			quantityInput.required = true;
			quantityInput.value = cartProduct.quantity;
			const quantityErrorMessage = document.createElement("div");
			quantityErrorMessage.classList.add("quantity-error-message");
			quantityContainer.append(quantityLabel);
			quantityContainer.append(quantityInput);
			quantityContainer.append(quantityErrorMessage);

			const deleteContainer = document.createElement("div");
			deleteContainer.classList.add("cart__item__content__settings__delete");
			const deleteButton = document.createElement("p");
			deleteButton.classList.add("deleteItem");
			deleteButton.innerText = "Supprimer";
			deleteContainer.append(deleteButton);

			settings.append(quantityContainer);
			settings.append(deleteContainer);

			content.append(titleAndPriceContainer);
			content.append(settings);

			productContainer.append(imageContainer);
			productContainer.append(content);
			productsContainer.append(productContainer);
		});

		productsContainer.append(createEmptyCartButton());
	}
}

/**
 * Manage the product quantity inputs separately to clarify the main function.
 * @param {Cart} cart
 * @param {ProductManager} productManager
 */
function manageQuantityInputs(cart, productManager) {
	const quantityInputs = document.querySelectorAll(".itemQuantity");

	quantityInputs.forEach(quantityInput => {
		quantityInput.onchange = () => {
			if (checkInput(quantityInput)) {
				const productContainer = quantityInput.closest(".cart__item");
				const productId = productContainer.dataset.id;
				const color = productContainer.dataset.color;

				const cartProduct = cart.getProduct(productId, color);
				const initialQuantity = cartProduct.quantity;
				cartProduct.quantity = Number(quantityInput.value);

				cart.updateTotals(
					productManager.getProduct(productId).price,
					initialQuantity,
					cartProduct.quantity
				);
				updateTotalDisplayers(cart);

				cart.save();
			}
		};
	});
}

/**
 * Remove all the product containers (so all the products) from the DOM.
 */
function removeAllProductContainers() {
	const productContainers = document.querySelectorAll(".cart__item");

	productContainers.forEach(productContainer => productContainer.remove());
}

/**
 * Remove from the DOM the empty cart buttons.
 */
function removeEmptyCartButtons() {
	const emptyCartButtons = document.querySelectorAll(".empty-cart-btn");

	emptyCartButtons.forEach(emptyCartButton => emptyCartButton.remove());
}

/**
 * Manage the product delete buttons separately to clarify the main function.
 * @param {Cart} cart
 * @param {ProductManager} productManager
 */
function manageDeleteButtons(cart, productManager) {
	const deleteButtons = document.querySelectorAll(".deleteItem");

	deleteButtons.forEach(deleteButton => {
		deleteButton.onclick = () => {
			const productContainer = deleteButton.closest(".cart__item");
			const productId = productContainer.dataset.id;
			const color = productContainer.dataset.color;

			const initialQuantity = cart.getProduct(productId, color).quantity;
			cart.removeProduct(productId, color);
			productContainer.remove();

			cart.updateTotals(
				productManager.getProduct(productId).price,
				initialQuantity,
				0
			);
			updateTotalDisplayers(cart);

			// if there is no products anymore in the cart, remove the empty cart buttons
			if (!cart.totalQuantity) removeEmptyCartButtons();

			cart.save();

			sendMessageToUser("Le produit a bien été retiré de votre panier !");
		};
	});
}

/**
 * Manage the empty cart buttons separately to clarify the main function.
 * @param {Cart} cart
 */
function manageEmptyCartButtons(cart) {
	const emptyCartButtons = document.querySelectorAll(".empty-cart-btn");

	emptyCartButtons.forEach(emptyCartButton => {
		emptyCartButton.onclick = () => {
			cart.emptyCart();

			updateTotalDisplayers(cart);
			removeAllProductContainers();
			removeEmptyCartButtons();

			cart.save();

			sendMessageToUser("Votre panier a bien été vidé !");
		};
	});
}

/**
 * Update the total cart quantity and total cart price displayers.
 * @param {Cart} cart
 */
function updateTotalDisplayers(cart) {
	const totalQuantityDisplayer = document.querySelector("#totalQuantity");
	const totalPriceDisplayer = document.querySelector("#totalPrice");

	totalQuantityDisplayer.innerText = cart.totalQuantity;
	totalPriceDisplayer.innerText = cart.totalPrice.toLocaleString();
	updateCartLink(cart.totalQuantity);
}

/**
 * Custom the first name input validation to make sure it communicates a comprehensive error.
 */
function customFirstNameInputValidation() {
	const input = document.querySelector("#firstName");
	const validityState = input.validity;

	if (validityState.patternMismatch) {
		input.setCustomValidity(
			"Le prénom ne doit pas contenir de chiffres ni de caractères de ponctuation excepté le tiret (-)."
		);
	} else {
		input.setCustomValidity("");
	}
}

/**
 * Custom the last name input validation to make sure it communicates a comprehensive error.
 */
function customLastNameInputValidation() {
	const input = document.querySelector("#lastName");
	const validityState = input.validity;

	if (validityState.patternMismatch) {
		input.setCustomValidity(
			"Le nom ne doit pas contenir de chiffres ni de caractères de ponctuation excepté le tiret (-)."
		);
	} else {
		input.setCustomValidity("");
	}
}

/**
 * Custom the address input validation to make sure it communicates a comprehensive error.
 */
function customAddressInputValidation() {
	const input = document.querySelector("#address");
	const validityState = input.validity;

	if (validityState.patternMismatch) {
		input.setCustomValidity(
			"L'adresse ne doit pas contenir de caractères de ponctuation excepté le tiret (-)."
		);
	} else {
		input.setCustomValidity("");
	}
}

/**
 * Custom the city input validation to make sure it communicates a comprehensive error.
 */
function customCityInputValidation() {
	const input = document.querySelector("#city");
	const validityState = input.validity;

	if (validityState.patternMismatch) {
		input.setCustomValidity(
			"La ville ne doit pas contenir de chiffres ni de caractères de ponctuation excepté le tiret (-)."
		);
	} else {
		input.setCustomValidity("");
	}
}

/**
 * Check if all the inputs are valid and if not focus the first invalid one.
 * @returns {boolean} Boolean true if all the inputs are valid, false if there is at least one error.
 */
function checkInputs(inputs) {
	let areInputsValid = true; // suppose all the inputs are valid at the beginning
	let isInputFocused = false; // for the moment no error so no focused input

	inputs.forEach(input => {
		const isInputValid = checkInput(input);

		// if an error is detected and it is the first, focus the concerned input
		if (!isInputValid && !isInputFocused) {
			input.focus();
			isInputFocused = true;
		}

		areInputsValid &= isInputValid;
	});

	return areInputsValid;
}

/**
 * Manage the order form separately to clarify the main function.
 * @param {Cart} cart
 */
function manageForm(cart) {
	document.querySelector("form").onsubmit = async e => {
		e.preventDefault();

		// first, check if the cart is empty
		if (!cart.isEmpty()) {
			// second, custom the inputs validation to make sure they communicate a comprehensive error
			customFirstNameInputValidation();
			customLastNameInputValidation();
			customAddressInputValidation();
			customCityInputValidation();

			// third, check if the order is valid
			const cartInputs = ".itemQuantity";
			const formInputs = "form input:not([type=submit])"; // submit input does not need to be validated
			const inputsToValid = document.querySelectorAll(
				`${cartInputs}, ${formInputs}`
			);
			const isOrderValid = checkInputs(inputsToValid);

			if (isOrderValid) {
				// finally, build the order and send it to the server
				const contact = {
					firstName: document.querySelector("#firstName").value,
					lastName: document.querySelector("#lastName").value,
					address: document.querySelector("#address").value,
					city: document.querySelector("#city").value,
					email: document.querySelector("#email").value,
				};

				const products = cart.products.map(
					cartProduct => cartProduct.productId
				);

				const order = await postOrder({ contact, products }).catch(
					console.error
				);

				cart.emptyCart(); // empty the cart after the order is sent
				cart.save();

				// redirect the user to the confirmation page
				window.location = "./confirmation.html?orderId=" + order.orderId;
			}
		} else {
			sendMessageToUser("Votre panier est vide...");
		}
	};
}

async function main() {
	// load the configuration data and assign them to the "Config" class directly to create some static properties
	Object.assign(Config, await loadConfig());

	const cart = new Cart(getCart());
	const promises = cart.products.map(cartProduct =>
		getProductById(cartProduct.productId)
	);
	const productManager = new ProductManager(
		await Promise.all(promises).catch(console.error)
	);

	display(cart.products, productManager);
	updateTotalDisplayers(cart);
	manageQuantityInputs(cart, productManager);
	manageDeleteButtons(cart, productManager);
	manageEmptyCartButtons(cart);
	manageForm(cart);
}

main();
