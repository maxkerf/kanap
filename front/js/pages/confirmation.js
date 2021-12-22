const searchParams = new URLSearchParams(window.location.search);

if (searchParams.has("orderId")) {
	document.querySelector("#orderId").innerText = searchParams.get("orderId");
}
