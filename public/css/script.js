
// axios 
async function itemsData() {
	try {
		const response = await axios.get("http://localhost:3000/deneme/items");
		console.log(response.data);
	}
	catch (error) {
		console.log(error);
	}
}

itemsData();