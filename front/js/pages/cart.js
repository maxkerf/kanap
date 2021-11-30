const productsContainer = document.querySelector("#cart__items");
const totalQuantityDisplayer = document.querySelector("#totalQuantity");
const totalPriceDisplayer = document.querySelector("#totalPrice");

function display(products) {
	if (products.length) {
		productsContainer.innerHTML = `<div class="empty-cart-btn">Vider le panier</div>`;

		products.forEach(product => {
			productsContainer.innerHTML += `<article class="cart__item" data-id=${
				product.id
			} data-color=${product.color}>
			<div class="cart__item__img">
				<img src=${rewriteImageUrl(product.imageUrl, "medium")} alt="${product.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${product.name + " " + product.color}</h2>
					<p>${product.price} €</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Quantité : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${
							product.quantity
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

function manageQuantityInputs(cart, productManager) {
	const quantityInputs = document.querySelectorAll(".itemQuantity");

	quantityInputs.forEach(quantityInput => {
		quantityInput.onchange = () => {
			checkQuantityInput(quantityInput);

			const productContainer = quantityInput.closest(".cart__item");
			const id = productContainer.dataset.id;
			const color = productContainer.dataset.color;

			const productInCart = cart.getProduct(id, color);
			const initialQuantity = productInCart.quantity;
			productInCart.quantity = Number(quantityInput.value);

			cart.updateTotals(
				productManager.getProduct(id).price,
				initialQuantity,
				productInCart.quantity
			);
			updateTotalDisplayers(cart);

			cart.save();
		};
	});
}

function manageDeleteButtons(cart, productManager) {
	const deleteButtons = document.querySelectorAll(".deleteItem");

	deleteButtons.forEach(deleteButton => {
		deleteButton.onclick = () => {
			const productContainer = deleteButton.closest(".cart__item");
			const id = productContainer.dataset.id;
			const color = productContainer.dataset.color;

			const initialQuantity = cart.getProduct(id, color).quantity;
			cart.removeProduct(id, color);
			productContainer.remove();

			cart.updateTotals(
				productManager.getProduct(id).price,
				initialQuantity,
				0
			);
			updateTotalDisplayers(cart);

			cart.save();

			sendMessageToUser("Le produit a bien été retiré de votre panier !");
		};
	});
}

function manageEmptyCartButtons(cart) {
	document.querySelectorAll(".empty-cart-btn").forEach(
		btn =>
			(btn.onclick = () => {
				cart.emptyCart();

				document
					.querySelectorAll(".cart__item, .empty-cart-btn")
					.forEach(el => el.remove());

				updateTotalDisplayers(cart);

				cart.save();
			})
	);
}

function updateTotalDisplayers(cart) {
	totalQuantityDisplayer.innerHTML = cart.totalQuantity;
	totalPriceDisplayer.innerHTML = cart.totalPrice.toLocaleString();
	updateCartLink(cart.totalQuantity);
}

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

			const products = cart.products.map(product => product.id);

			const object = await postOrder({ contact, products }).catch(
				console.error
			);

			cart.emptyCart();
			cart.save();

			window.location = "./confirmation.html?orderId=" + object.orderId;
		}
	};
}

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

function isFormValid() {
	let validForm = true;
	let focusedInput = false;

	document.querySelectorAll("form input:not([type=submit])").forEach(input => {
		const validInput = input.checkValidity();

		input.nextElementSibling.innerHTML = !validInput
			? input.validationMessage
			: "";

		validForm &= validInput;

		if (!validForm && !focusedInput) {
			input.focus();
			focusedInput = true;
		}
	});

	return validForm;
}

async function main() {
	const cart = new Cart(await getCart());
	const promises = cart.products.map(product => getProductById(product.id));
	const productManager = new ProductManager(
		await Promise.all(promises).catch(console.error)
	);
	const productsToDisplay = [];

	for (let i = 0; i < cart.products.length; i++) {
		productsToDisplay.push({
			id: productManager.products[i]._id,
			imageUrl: productManager.products[i].imageUrl,
			altTxt: productManager.products[i].altTxt,
			name: productManager.products[i].name,
			price: productManager.products[i].price,
			color: cart.products[i].color,
			quantity: cart.products[i].quantity,
		});
	}

	display(productsToDisplay);
	updateTotalDisplayers(cart);
	manageQuantityInputs(cart, productManager);
	manageDeleteButtons(cart, productManager);
	manageEmptyCartButtons(cart);
	manageForm(cart);
}

main();
