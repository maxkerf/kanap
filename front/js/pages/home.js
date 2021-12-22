/**
 * Display the products on the page.
 * @param {Product[]} products - The products to display.
 */
function display(products) {
	const productsContainer = document.querySelector("#items");

	products.forEach(product => {
		const productContainer = document.createElement("a");
		productContainer.href = `./product.html?id=${product._id}`;

		const article = document.createElement("article");

		const image = document.createElement("img");
		const imageUrl = rewriteImageUrl(product.imageUrl, "small");
		image.src = imageUrl;
		image.alt = product.altTxt;

		const name = document.createElement("h3");
		name.classList.add("productName");
		name.innerText = product.name;

		const description = document.createElement("p");
		description.classList.add("productDescription");
		description.innerText = product.description;

		article.append(image);
		article.append(name);
		article.append(description);
		productContainer.append(article);
		productsContainer.append(productContainer);
	});
}

async function main() {
	// load the configuration data and assign them to the "Config" class directly to create some static properties
	Object.assign(Config, await loadConfig());

	const productManager = new ProductManager(
		await getAllProducts().catch(console.error)
	);
	const cart = new Cart(getCart());

	display(productManager.products);
	updateCartLink(cart.totalQuantity);
}

main();
