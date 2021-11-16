class Cart {
	constructor() {
		this.products =
			localStorage.getItem("kanap-cart") === null
				? []
				: JSON.parse(localStorage.getItem("kanap-cart"));
	}

	addProduct(productToAdd) {
		if (this.hasProduct(productToAdd.id, productToAdd.color)) {
			const product = this.getProduct(productToAdd.id, productToAdd.color);

			product.quantity + productToAdd.quantity <= 100
				? (product.quantity += productToAdd.quantity)
				: (product.quantity = 100);
		} else {
			this.products.push(productToAdd);
		}

		this.save();
	}

	removeProduct(id, color) {
		const product = this.getProduct(id, color);

		this.products.splice(this.products.indexOf(product), 1);

		this.save();
	}

	getProduct(id, color) {
		return this.products.find(
			product => product.id === id && product.color === color
		);
	}

	hasProduct(id, color) {
		return this.getProduct(id, color);
	}

	save() {
		localStorage.setItem("kanap-cart", JSON.stringify(this.products));
	}
}
