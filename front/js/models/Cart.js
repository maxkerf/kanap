/**
 * @class
 * @classdesc Class representing the cart.
 */
class Cart {
	/**
	 * Create a cart with the given data.
	 * @param {Object} [data={ products: [], totalQuantity: 0, totalPrice: 0 }]
	 * @param {Object[]} data.products - The products in the cart.
	 * @param {string} data.products[].productId - The id of the product.
	 * @param {string} data.products[].color
	 * @param {string} data.products[].quantity
	 * @param {number} data.totalQuantity - The total quantity of articles in the cart.
	 * @param {number} data.totalPrice - The total cart price.
	 */
	constructor(data) {
		// check if data is null or not
		data ? Object.assign(this, data) : this.emptyCart();
	}

	/**
	 * Check if a product is already stored in the cart or not.
	 * @param {string} productId - The id of the desired product.
	 * @param {string} color - The color of the desired product.
	 * @returns {boolean} A boolean true if the product exists, false if not.
	 */
	hasProduct(productId, color) {
		// same way than the "getProduct" method but the function name "hasProduct" is more explicit to just know if it exists or not
		return this.getProduct(productId, color) ? true : false;
	}

	/**
	 * Get a product stored in the cart.
	 * @param {string} productId - The id of the desired product.
	 * @param {string} color - The color of the desired product.
	 * @returns {CartProduct} The desired product.
	 */
	getProduct(productId, color) {
		return this.products.find(
			cartProduct =>
				cartProduct.productId === productId && cartProduct.color === color
		);
	}

	/**
	 * Add a product in the cart.
	 * @param {Object} productToAdd
	 * @param {string} productToAdd.productId
	 * @param {string} productToAdd.color
	 * @param {number} productToAdd.quantity
	 * @returns {Object} The product added.
	 */
	addProduct(productToAdd) {
		const productId = productToAdd.productId;

		/* 
		if the product already exists, add the quantity to the existing product
		else add the entire product
		*/
		if (this.hasProduct(productId, productToAdd.color)) {
			const cartProduct = this.getProduct(productId, productToAdd.color);
			const maxQuantity = 100;

			// check if the quantity added does not exceed the maximum quantity
			cartProduct.quantity + productToAdd.quantity <= maxQuantity
				? (cartProduct.quantity += productToAdd.quantity)
				: (cartProduct.quantity = maxQuantity);
		} else {
			productToAdd.id = this.products.length
				? this.products[this.products.length - 1].id + 1
				: 1;
			this.products.push(new CartProduct(productToAdd));
		}

		return this.getProduct(productId, productToAdd.color);
	}

	/**
	 * Remove a product from the cart.
	 * @param {string} productId - The id of the product to remove.
	 * @param {string} color - The color of the product to remove.
	 */
	removeProduct(productId, color) {
		const cartProduct = this.getProduct(productId, color);

		this.products.splice(this.products.indexOf(cartProduct), 1);
	}

	/**
	 * Update the total price cart and the total articles in the cart.
	 * @param {number} price - The product price.
	 * @param {string} initialQuantity - The product quantity in the cart before modifications (add a product, remove one, etc.).
	 * @param {string} currentQuantity - The product quantity in the cart after modifications (add a product, remove one, etc.).
	 */
	updateTotals(price, initialQuantity, currentQuantity) {
		const quantityDifference = currentQuantity - initialQuantity;

		this.totalQuantity += quantityDifference;
		this.totalPrice += price * quantityDifference;
	}

	/**
	 * Empty the cart or create an empty cart, it depends on the situation.
	 */
	emptyCart() {
		Object.assign(this, { products: [], totalQuantity: 0, totalPrice: 0 });
	}

	/**
	 * Save the current cart data in the local storage.
	 */
	save() {
		localStorage.setItem(Config.keyCart, JSON.stringify(this));
	}
}
