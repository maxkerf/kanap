/**
 * Display the product on the page and change the page title.
 * @param {Product} product - The product to display.
 */
function display(product) {
	const productContainer = document.querySelector(".item");
	const imageUrl = rewriteImageUrl(product.imageUrl, "large");
	const colors = product.colors
		.map(color => "<option value=" + color + ">" + color + "</option>")
		.join("\n");

	document.title = product.name;
	productContainer.innerHTML = `<article>
			<div class="item__img">
				<img src=${imageUrl} alt="${product.altTxt}">
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

/**
 * Manage the product quantity input separately to clarify the main function.
 */
function manageQuantityInput() {
	const quantityInput = document.querySelector("#quantity");

	quantityInput.onchange = () => checkQuantityInput(quantityInput);
}

/**
 * Manage the cart feature separately to clarify the main function.
 * @param {Cart} cart
 * @param {Product} product
 */
function manageCart(cart, product) {
	const addToCartButton = document.querySelector("#addToCart");
	const colorInput = document.querySelector("#colors");
	const quantityInput = document.querySelector("#quantity");

	addToCartButton.onclick = () => {
		const productId = product._id;
		const color = colorInput.value;
		const quantity = Number(quantityInput.value);

		/* const cartProduct = new CartProduct({
			productId: productId,
			color: colorInput.value,
			quantity: Number(quantityInput.value),
		}); */

		const initialQuantity = cart.hasProduct(productId, color)
			? cart.getProduct(productId, color).quantity
			: 0;

		const productAdded = cart.addProduct({
			productId: productId,
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
	// load the configuration data and assign them to the "Config" class directly to create some static properties
	Object.assign(Config, await loadConfig());

	const searchParams = new URLSearchParams(window.location.search);
	const product = new Product(
		await getProductById(searchParams.get("id")).catch(console.error)
	);
	const cart = new Cart(getCart());

	display(product);
	updateCartLink(cart.totalQuantity);
	manageQuantityInput();
	manageCart(cart, product);
}

main();
