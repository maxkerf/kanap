/**
 * Display the product on the page and change the page title.
 * @param {Product} product - The product to display.
 */
function display(product) {
	const productContainer = document.querySelector(".item");

	if (Object.keys(product).length) {
		const imageContainer = document.querySelector(".item__img");
		const title = document.querySelector("#title");
		const price = document.querySelector("#price");
		const description = document.querySelector("#description");
		const colors = document.querySelector("#colors");

		document.title = product.name;

		const image = document.createElement("img");
		const imageUrl = rewriteImageUrl(product.imageUrl, "large");
		image.src = imageUrl;
		image.alt = product.altTxt;
		imageContainer.append(image);

		title.innerText = product.name;
		price.innerText = product.price;
		description.innerText = product.description;

		product.colors.forEach(color => {
			const option = document.createElement("option");
			option.value = color;
			option.innerText = color;
			colors.append(option);
		});
	} else {
		productContainer.innerText = "Produit introuvable...";
	}
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

	if (Object.keys(product).length) {
		manageQuantityInput();
		manageCart(cart, product);
	}
}

main();
