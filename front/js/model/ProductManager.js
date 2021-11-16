class ProductManager {
	constructor(objects) {
		this.products = objects.map(object => new Product(object));
	}

	getProduct(id) {
		return this.products.find(product => product._id === id);
	}
}
