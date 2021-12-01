/**
 * @class
 * @classdesc Class representing a product.
 */
class Product {
	/**
	 * Create a product with the given data.
	 * @param {Object} data
	 * @param {string[]} data.colors
	 * @param {string} data._id
	 * @param {string} data.name
	 * @param {number} data.price
	 * @param {string} data.imageUrl
	 * @param {string} data.description
	 * @param {string} data.altTxt
	 */
	constructor(data) {
		Object.assign(this, data);
	}
}
