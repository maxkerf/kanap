loadConfig().then(config => {
	fetch(config.host + "/api/products/")
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw "response not ok";
			}
		})
		.then(objects => {
			const productManager = new ProductManager(objects);

			productManager.products.forEach(product => {
				document.querySelector(
					"#items"
				).innerHTML += `<a href="./product.html?id=${product._id}">
					<article>
						<img src=${
							product.imageUrl.slice(0, 29) +
							"small/" +
							product.imageUrl.slice(29)
						} alt="${product.altTxt}" />
						<h3 class="productName">${product.name}</h3>
						<p class="productDescription">${product.description}</p>
					</article>
				</a>`;
			});
		})
		.catch(err => console.log("Error detected: " + err));
});
