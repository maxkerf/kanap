const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

if (searchParams.has("id")) {
	const id = searchParams.get("id");
	console.log("id: " + id);
}
