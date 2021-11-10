loadConfig().then(config => {
	fetch(config.host + "/api/products/")
		.then(response => response.json())
		.then(products => {
			products.forEach(product => {
				document.querySelector(
					"#items"
				).innerHTML += `<a href="./product.html?id=${product._id}">
													<article>
														<img src=${product.imageUrl} alt=${product.altTxt} />
														<h3 class="productName">${product.name}</h3>
														<p class="productDescription">${product.description}</p>
													</article>
												</a>`;
			});
		})
		.catch(err => console.log("Error detected: " + err));
});
