/**
 * Load the configuration file to get the configuration data.
 * @returns {Promise} The configuration data.
 */
async function loadConfig() {
	const response = await fetch("../config.json");
	const data = response.json();

	return data;
}
