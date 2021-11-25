const productContainer = document.querySelector(".item");

function display(product) {
	const colors = product.colors
		.map(color => "<option value=" + color + ">" + color + "</option>")
		.join("\n");

	productContainer.innerHTML = `<article>
			<div class="item__img">
				<img src=${rewriteImageUrl(product.imageUrl, "large")} alt="${product.altTxt}">
			</div>
			<div class="item__content">
				<div class="item__content__titlePrice">
					<h1 id="title">${product.name}</h1>
					<p>Prix : <span id="price">${product.price}</span>€</p>
				</div>

				<div class="item__content__description">
					<p class="item__content__description__title">Description :</p>
					<p id="description">${product.description}</p>
				</div>

				<div class="item__content__settings">
					<div class="item__content__settings__color">
						<label for="color-select">Choisir une couleur :</label>
						<select name="color-select" id="colors">
							${colors}
						</select>
					</div>

					<div class="item__content__settings__quantity">
						<label for="itemQuantity"
							>Nombre d'article(s) (1-100) :</label
						>
						<input
							type="number"
							name="itemQuantity"
							min="1"
							max="100"
							value="1"
							id="quantity"
						/>
					</div>
				</div>

				<div class="item__content__addButton">
					<button id="addToCart">Ajouter au panier</button>
				</div>
			</div>
		</article>`;
}

function manageQuantityInput() {
	const quantityInput = document.querySelector("#quantity");

	quantityInput.onchange = () => checkQuantityInput(quantityInput);
}

function manageCart(cart, product) {
	const addToCartButton = document.querySelector("#addToCart");
	const colorInput = document.querySelector("#colors");
	const quantityInput = document.querySelector("#quantity");

	addToCartButton.onclick = () => {
		const id = product._id;
		const color = colorInput.value;
		const quantity = Number(quantityInput.value);

		const initialQuantity = cart.hasProduct(id, color)
			? cart.getProduct(id, color).quantity
			: 0;

		const productAdded = cart.addProduct({
			id: id,
			color: color,
			quantity: quantity,
		});

		cart.updateTotals(product.price, initialQuantity, productAdded.quantity);
		updateCartLink(cart.totalQuantity);

		cart.save();

		sendMessageToUser("Le produit a bien été ajouté à votre panier !");
	};
}

async function main() {
	const searchParams = new URLSearchParams(window.location.search);
	const product = new Product(await getProductById(searchParams.get("id")));
	const cart = new Cart(await getCart());

	display(product);
	updateCartLink(cart.totalQuantity);
	manageQuantityInput();
	manageCart(cart, product);

	/* if (searchParams.has("id")) {
		const object = await getProductById(searchParams.get("id"));

		// check if object is empty or not
		if (Object.keys(object).length) {
			const product = new Product(object);

			display(product);
			updateCartLink();
			manageQuantityInput();
			manageCart(product);
		} else {
			productContainer.innerHTML = "Oups, produit introuvable...";
		}
	} else {
		productContainer.innerHTML = "Oups, aucun produit sélectionné...";
	} */
}

main();
