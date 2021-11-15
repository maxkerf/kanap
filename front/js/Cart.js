class Cart {
	constructor() {
		this.products =
			localStorage.getItem("kanap-cart") === null
				? []
				: JSON.parse(localStorage.getItem("kanap-cart"));
	}

	addProduct(productToAdd) {
		if (this.hasProduct(productToAdd)) {
			const product = this.getProduct(productToAdd);

			if (productToAdd.quantity >= 1 && productToAdd.quantity <= 100) {
				product.quantity + productToAdd.quantity <= 100
					? (product.quantity += productToAdd.quantity)
					: (product.quantity = 100);
			}
		} else {
			this.products.push(productToAdd);
		}

		this.save(this.products);
	}

	getProduct(productToAdd) {
		return this.products.find(
			product =>
				product.id === productToAdd.id && product.color === productToAdd.color
		);
	}

	hasProduct(productToAdd) {
		return this.getProduct(productToAdd);
	}

	save() {
		localStorage.setItem("kanap-cart", JSON.stringify(this.products));
	}
}
