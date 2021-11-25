async function getAllProducts() {
	const config = await loadConfig();
	const response = await fetch(config.host + "/api/products/");
	const data = await response.json();

	return data;
}

async function getProductById(id) {
	const config = await loadConfig();
	const response = await fetch(config.host + "/api/products/" + id);
	const data = await response.json();

	return data;
}

async function postOrder(order) {
	const config = await loadConfig();
	const response = await fetch(config.host + "/api/products/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order),
	});
	const data = await response.json();

	return data;
}

async function getCart() {
	const config = await loadConfig();
	const item = localStorage.getItem(config.keyCart);
	const data = JSON.parse(item);

	return data;
}
