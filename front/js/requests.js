/**
 * Get all the products stored in the database.
 * @returns {Promise} A list of products.
 */
async function getAllProducts() {
	const response = await fetch(Config.host + "/api/products/");
	const data = await response.json();

	return data;
}

/**
 * Get a product stored in the database with a given id.
 * @param {number} id - The id of the desired product.
 * @returns {Promise} The desired product.
 */
async function getProductById(id) {
	if (!id) throw "Product ID missing...";

	const response = await fetch(Config.host + "/api/products/" + id);
	const data = await response.json();

	return data;
}

/**
 * Post an order.
 * @param {Object} order - The order to pass.
 * @param {Object} order.contact - Buyer informations.
 * @param {string} order.contact.firstName - Buyer first name.
 * @param {string} order.contact.lastName - Buyer last name.
 * @param {string} order.contact.address - Buyer address.
 * @param {string} order.contact.city - Buyer city.
 * @param {string} order.contact.email - Buyer email.
 * @param {string[]} order.products - An id list of the desired products.
 * @returns {Promise} The order with an order id.
 */
async function postOrder(order) {
	const response = await fetch(Config.host + "/api/products/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(order),
	});
	const data = await response.json();

	return data;
}

/**
 * Get the cart data stored in the local storage.
 * @returns {Object} The cart data.
 */
function getCart() {
	const item = localStorage.getItem(Config.keyCart);
	const data = JSON.parse(item);

	return data;
}
