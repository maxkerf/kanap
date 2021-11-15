const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has("id")) {
	const id = searchParams.get("id");

	loadConfig().then(config => {
		fetch(config.host + "/api/products/" + id)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					document.querySelector(".item").innerHTML =
						"Oups, produit introuvable...";

					throw "Product not found";
				}
			})
			.then(product => {
				document.title = product.name;

				document.querySelector(".item").innerHTML = `<article>
          <div class="item__img">
            <img src=${product.imageUrl} alt="${product.altTxt}">
          </div>
          <div class="item__content">
            <div class="item__content__titlePrice">
              <h1 id="title">${product.name}</h1>
              <p>Prix : <span id="price">${product.price}</span>€</p>
            </div>

            <div class="item__content__description">
              <p class="item__content__description__title">Description :</p>
              <p id="description">${product.description}</p>
            </div>

            <div class="item__content__settings">
              <div class="item__content__settings__color">
                <label for="color-select">Choisir une couleur :</label>
                <select name="color-select" id="colors">
                  <!-- <option value="">--SVP, choisissez une couleur --</option> -->
                  ${product.colors
										.map(
											color =>
												"<option value=" + color + ">" + color + "</option>"
										)
										.join("\n")}
                </select>
              </div>

              <div class="item__content__settings__quantity">
                <label for="itemQuantity"
                  >Nombre d'article(s) (1-100) :</label
                >
                <input
                  type="number"
                  name="itemQuantity"
                  min="1"
                  max="100"
                  value="1"
                  id="quantity"
                />
              </div>
            </div>

            <div class="item__content__addButton">
              <button id="addToCart">Ajouter au panier</button>
            </div>
          </div>
        </article>`;

				const cart = new Cart();

				document.querySelector("#addToCart").addEventListener("click", () => {
					cart.addProduct({
						id: id,
						color: document.querySelector("#colors").value,
						quantity: Number(document.querySelector("#quantity").value),
					});
				});
			})
			.catch(err => console.log("Error detected: " + err));
	});
}
