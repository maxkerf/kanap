class CartProduct {
	/**
	 * Create a cart product with the given data.
	 * @param {Object} data
	 * @param {number} data.id - The id of the cart product.
	 * @param {string} data.productId - The id of the product.
	 * @param {string} data.color
	 * @param {number} data.quantity
	 */
	constructor(data, id) {
		this.id = id;
		Object.assign(this, data);
	}
}
