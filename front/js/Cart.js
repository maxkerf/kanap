const cart = new Cart();

loadConfig().then(config => {
	fetch(config.host + "/api/products/")
		.then(res => res.json())
		.then(objects => {
			const productManager = new ProductManager(objects);

			const products = [];

			cart.products.forEach(productInCart => {
				const product = productManager.getProduct(productInCart.id);

				products.push({
					id: product._id,
					imageUrl: product.imageUrl,
					altTxt: product.altTxt,
					name: product.name,
					price: product.price,
					color: productInCart.color,
					quantity: productInCart.quantity,
				});
			});

			products.forEach(product => {
				document.querySelector(
					"#cart__items"
				).innerHTML += `<article class="cart__item" data-id=${
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

			updateCartPrice(productManager.products);
			manageQuantityInputs(productManager.products);
			manageDeleteButtons(productManager.products);
		})
		.catch(err => console.log("Error detected: " + err));
});

function manageQuantityInputs(products) {
	document.querySelectorAll(".itemQuantity").forEach(itemQuantity => {
		itemQuantity.addEventListener("change", () => {
			if (itemQuantity.value < 1) itemQuantity.value = 1;
			else if (itemQuantity.value > 100) itemQuantity.value = 100;

			const cartItem = itemQuantity.closest(".cart__item");
			const product = cart.getProduct(
				cartItem.dataset.id,
				cartItem.dataset.color
			);

			product.quantity = Number(itemQuantity.value);

			cart.save();
			updateCartPrice(products);
		});
	});
}

function manageDeleteButtons(products) {
	document.querySelectorAll(".deleteItem").forEach(deleteItem => {
		deleteItem.addEventListener("click", () => {
			const cartItem = deleteItem.closest(".cart__item");
			cartItem.remove();
			cart.removeProduct(cartItem.dataset.id, cartItem.dataset.color);
			updateCartPrice(products);
			alert("Le produit a bien été retiré de votre panier !");
		});
	});
}

function updateCartPrice(products) {
	updateTotalQuantity();
	updateTotalPrice(products);
}

function updateTotalQuantity() {
	document.querySelector("#totalQuantity").innerHTML = cart.products.length;
}

function updateTotalPrice(products) {
	let total = 0;

	cart.products.forEach(productInCart => {
		total +=
			products.find(product => product._id === productInCart.id).price *
			productInCart.quantity;
	});

	document.querySelector("#totalPrice").innerHTML = total;
}

document.querySelector("form").addEventListener("submit", e => {
	e.preventDefault();

	let valid = true;

	document.querySelectorAll("form input").forEach(input => {
		if (!input.reportValidity()) {
			document.querySelector("#firstNameErrorMsg").innerHTML = "Erreur !";
		}
		valid &= input.reportValidity();
	});

	if (valid) {
		const contact = {
			firstName: document.querySelector("#firstName").value,
			lastName: document.querySelector("#lastName").value,
			address: document.querySelector("#address").value,
			city: document.querySelector("#city").value,
			email: document.querySelector("#email").value,
		};

		const products = cart.products.map(product => product.id);

		loadConfig().then(config => {
			fetch(config.host + "/api/products/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contact, products }),
			})
				.then(res => res.json())
				.then(object => {
					console.log(object);
					console.log(object.orderId);
					window.location = "./confirmation.html?orderId=" + object.orderId;
				})
				.catch(err => console.log("Error detected: " + err));
		});
	}
});