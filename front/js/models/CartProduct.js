/**
 * @class
 * @classdesc Class representing a product in the cart.
 */
class CartProduct {
	/**
	 * Create a cart product with the given data.
	 * @param {Object} data
	 * @param {number} data.id - The id of the cart product.
	 * @param {string} data.productId - The id of the product.
	 * @param {string} data.color
	 * @param {number} data.quantity
	 */
	constructor(data) {
		Object.assign(this, data);
	}
}
