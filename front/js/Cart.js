const cart = new Cart();

cart.products.forEach(product => {
	const color = product.color;
	const quantity = product.quantity;

	loadConfig().then(config => {
		fetch(config.host + "/api/products/" + product.id)
			.then(response => response.json())
			.then(product => {
				document.querySelector(
					"#cart__items"
				).innerHTML += `<article class="cart__item" data-id="${product.id}">
                      <div class="cart__item__img">
                        <img src=${product.imageUrl} alt="${product.altTxt}">
                      </div>
                      <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                          <h2>${product.name + " " + color}</h2>
                          <p>${product.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                            <p>Quantité : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
                          </div>
                          <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                          </div>
                        </div>
                      </div>
                    </article>`;
			});
	});
});
