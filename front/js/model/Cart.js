class Cart {
	constructor(object) {
		// check if object is null or not
		Object.assign(
			this,
			object ? object : { products: [], totalQuantity: 0, totalPrice: 0 }
		);
	}

	addProduct(productToAdd) {
		const id = productToAdd.id;
		const color = productToAdd.color;

		if (this.hasProduct(id, color)) {
			const product = this.getProduct(id, color);

			product.quantity + productToAdd.quantity <= 100
				? (product.quantity += productToAdd.quantity)
				: (product.quantity = 100);
		} else {
			this.products.push(productToAdd);
		}

		return this.getProduct(id, color);
	}

	removeProduct(id, color) {
		const product = this.getProduct(id, color);
		this.products.splice(this.products.indexOf(product), 1);
	}

	updateTotals(price, initialQuantity, currentQuantity) {
		this.totalQuantity = this.products.length;
		this.totalPrice += price * (currentQuantity - initialQuantity);
	}

	getProduct(id, color) {
		return this.products.find(
			product => product.id === id && product.color === color
		);
	}

	hasProduct(id, color) {
		return this.getProduct(id, color);
	}

	resetCart() {
		this.products.length = 0;
		this.totalQuantity = 0;
		this.totalPrice = 0;
	}

	save() {
		localStorage.setItem(
			"kanap-cart",
			JSON.stringify({
				products: this.products,
				totalQuantity: this.totalQuantity,
				totalPrice: this.totalPrice,
			})
		);
	}
}
