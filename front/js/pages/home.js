/**
 * Display the products on the page.
 * @param {Product[]} products - The products to display.
 */
function display(products) {
	const productsContainer = document.querySelector("#items");

	products.forEach(product => {
		const imageUrl = rewriteImageUrl(product.imageUrl, "small");

		productsContainer.innerHTML += `<a href="./product.html?id=${product._id}">
			<article>
				<img src=${imageUrl} alt="${product.altTxt}" />
				<h3 class="productName">${product.name}</h3>
				<p class="productDescription">${product.description}</p>
			</article>
		</a>`;
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
