/**
 * Display on the page the products stored in the cart.
 * @param {CartProduct[]} cartProducts - An array of cart products.
 * @param {ProductManager} productManager - A product manager containing an array of products.
 */
function display(cartProducts, productManager) {
	const productsContainer = document.querySelector("#cart__items");

	if (cartProducts.length) {
		productsContainer.innerHTML = `<div class="empty-cart-btn">Vider le panier</div>`;

		cartProducts.forEach(cartProduct => {
			const productId = cartProduct.productId;
			const product = productManager.getProduct(productId);
			const imageUrl = rewriteImageUrl(product.imageUrl, "medium");

			productsContainer.innerHTML += `<article class="cart__item" data-productId=${productId} data-color=${
				cartProduct.color
			}>
			<div class="cart__item__img">
				<img src=${imageUrl} alt="${product.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${product.name + " " + cartProduct.color}</h2>
					<p>${product.price} €</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Quantité : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${
							cartProduct.quantity
						}>
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem">Supprimer</p>
					</div>
				</div>
			</div>
		</article>`;
		});

		productsContainer.innerHTML += `<div class="empty-cart-btn">Vider le panier</div>`;
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
			checkQuantityInput(quantityInput);

			const productContainer = quantityInput.closest(".cart__item");
			const productId = productContainer.dataset.productId;
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
		};
	});
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
			const productId = productContainer.dataset.productId;
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
			if (cart.totalQuantity === 0)
				document.querySelectorAll(".empty-cart-btn").forEach(el => el.remove());

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
	document.querySelectorAll(".empty-cart-btn").forEach(
		btn =>
			(btn.onclick = () => {
				cart.emptyCart();

				// remove from the DOM the product containers and the empty cart buttons
				document
					.querySelectorAll(".cart__item, .empty-cart-btn")
					.forEach(el => el.remove());

				updateTotalDisplayers(cart);

				cart.save();

				sendMessageToUser("Votre panier a bien été vidé !");
			})
	);
}

/**
 * Update the total cart quantity and total cart price displayers.
 * @param {Cart} cart
 */
function updateTotalDisplayers(cart) {
	const totalQuantityDisplayer = document.querySelector("#totalQuantity");
	const totalPriceDisplayer = document.querySelector("#totalPrice");

	totalQuantityDisplayer.innerHTML = cart.totalQuantity;
	totalPriceDisplayer.innerHTML = cart.totalPrice.toLocaleString();
	updateCartLink(cart.totalQuantity);
}

/**
 * Custom the first input validation to make sure it communicates a comprehensive error.
 */
function customFirstNameInputValidation() {
	const firstNameInput = document.querySelector("#firstName");
	const validityState = firstNameInput.validity;

	if (validityState.patternMismatch) {
		firstNameInput.setCustomValidity(
			"Le prénom ne doit pas contenir de chiffres."
		);
	} else {
		firstNameInput.setCustomValidity("");
	}
}

/**
 * Check if all the form inputs are valid.
 * @returns {boolean} Boolean true if the entire form is valid, false if there is at least one error.
 */
function isFormValid() {
	let validForm = true;
	let focusedInput = false; // for the moment no error so no focused input

	// submit input does not need to be validated
	const inputsToValid = document.querySelectorAll(
		"form input:not([type=submit])"
	);

	inputsToValid.forEach(input => {
		const validInput = input.checkValidity();

		// if an error is detected, communicate an error message to the user
		input.nextElementSibling.innerHTML = !validInput
			? input.validationMessage
			: "";

		validForm &= validInput;

		// if an error is detected and it is the first, focus the concerned input
		if (!validInput && !focusedInput) {
			input.focus();
			focusedInput = true;
		}
	});

	return validForm;
}

/**
 * Manage the order form separately to clarify the main function.
 * @param {Cart} cart
 */
function manageForm(cart) {
	document.querySelector("form").onsubmit = async e => {
		e.preventDefault();

		customFirstNameInputValidation();

		if (isFormValid()) {
			const contact = {
				firstName: document.querySelector("#firstName").value,
				lastName: document.querySelector("#lastName").value,
				address: document.querySelector("#address").value,
				city: document.querySelector("#city").value,
				email: document.querySelector("#email").value,
			};

			const products = cart.products.map(cartProduct => cartProduct.productId);

			const order = await postOrder({ contact, products }).catch(console.error);

			cart.emptyCart(); // empty the cart after the order
			cart.save();

			window.location = "./confirmation.html?orderId=" + order.orderId;
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
