const productsContainer = document.querySelector("#cart__items");
const totalQuantityDisplayer = document.querySelector("#totalQuantity");
const totalPriceDisplayer = document.querySelector("#totalPrice");
const firstNameInput = document.querySelector("#firstName");
const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");

const cart = new Cart(JSON.parse(localStorage.getItem("kanap-cart")));

function display(products) {
	products.forEach(product => {
		productsContainer.innerHTML += `<article class="cart__item" data-id=${
			product.id
		} data-color=${product.color}>
			<div class="cart__item__img">
				<img src=${product.imageUrl} alt="${product.altTxt}">
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
}

function manageQuantityInputs(productManager) {
	const quantityInputs = document.querySelectorAll(".itemQuantity");

	quantityInputs.forEach(quantityInput => {
		quantityInput.onchange = () => {
			if (quantityInput.value < 1) quantityInput.value = 1;
			else if (quantityInput.value > 100) quantityInput.value = 100;

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
			updateTotalDisplayers();

			cart.save();
		};
	});
}

function manageDeleteButtons(productManager) {
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
			updateTotalDisplayers();

			cart.save();

			alert("Le produit a bien été retiré de votre panier !");
		};
	});
}

function updateTotalDisplayers() {
	totalQuantityDisplayer.innerHTML = cart.totalQuantity;
	totalPriceDisplayer.innerHTML = cart.totalPrice;
}

function manageForm() {
	document.querySelectorAll("form input").forEach(input => {
		input.onchange = () => {
			if (input.checkValidity()) input.nextElementSibling.innerHTML = "";
		};
		input.oninvalid = () =>
			(input.nextElementSibling.innerHTML = "Champ requis invalide.");
	});

	firstNameInput.oninvalid = () => {
		firstNameErrorMsg.innerHTML = "Le prénom ne doit pas contenir de chiffres.";
	};

	document.querySelector("form").onsubmit = async e => {
		e.preventDefault();

		let valid = true;

		document.querySelectorAll("form input").forEach(input => {
			valid &= input.reportValidity();
		});

		if (valid) {
			const contact = {
				firstName: firstNameInput.value,
				lastName: document.querySelector("#lastName").value,
				address: document.querySelector("#address").value,
				city: document.querySelector("#city").value,
				email: document.querySelector("#email").value,
			};

			const products = cart.products.map(product => product.id);

			const object = await postOrder({ contact, products });

			cart.resetCart();
			cart.save();

			window.location = "./confirmation.html?orderId=" + object.orderId;
		}
	};
}

async function main() {
	const promises = cart.products.map(product => getProductById(product.id));
	const objects = await Promise.all(promises);
	const productManager = new ProductManager(objects);
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
	updateTotalDisplayers();
	manageQuantityInputs(productManager);
	manageDeleteButtons(productManager);
	manageForm();
}

main();
