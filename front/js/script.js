const productsContainer = document.querySelector("#items");

function display(products) {
	products.forEach(product => {
		const imageUrl =
			product.imageUrl.slice(0, 29) + "small/" + product.imageUrl.slice(29);

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
	const objects = await getAllProducts();
	const productManager = new ProductManager(objects);

	display(productManager.products);
}

main();
