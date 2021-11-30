const productsContainer = document.querySelector("#items");

function display(products) {
	products.forEach(product => {
		productsContainer.innerHTML += `<a href="./product.html?id=${product._id}">
			<article>
				<img src=${rewriteImageUrl(product.imageUrl, "small")} alt="${
			product.altTxt
		}" />
				<h3 class="productName">${product.name}</h3>
				<p class="productDescription">${product.description}</p>
			</article>
		</a>`;
	});
}

async function main() {
	const productManager = new ProductManager(
		await getAllProducts().catch(console.error)
	);
	const cart = new Cart(await getCart());

	display(productManager.products);
	updateCartLink(cart.totalQuantity);
}

main();
