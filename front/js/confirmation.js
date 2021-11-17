const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has("orderId")) {
	document.querySelector("#orderId").innerHTML = searchParams.get("orderId");
}
