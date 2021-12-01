/**
 * @class
 * @classdesc Class used to stored a list of products and manage them.
 */
class ProductManager {
	/**
	 * Create an array of products.
	 * @param {Object[]} data - A list of products.
	 */
	constructor(data) {
		this.products = data.map(data => new Product(data));
	}

	/**
	 * Get a product with a given id.
	 * @param {Number} id - The id of the desired product.
	 * @returns {Product} The desired product.
	 */
	getProduct(id) {
		return this.products.find(product => product._id === id);
	}
}
