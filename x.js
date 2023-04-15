const amountInput = document.getElementById("amountInput");
const currencySelect = document.getElementById("currencySelect");

async function getExchangeRate(currency) {
	const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;
	try {
		const loader = createLoader();
		document.body.appendChild(loader);

		const response = await fetch(url);
		const data = await response.json();
		document.body.removeChild(loader);

		return data.rates[0].mid;
	} catch (error) {
		console.error(`Nie udało się pobrać kursu waluty. Błąd:${error}`);
		document.body.removeChild(loader);
	}
}

async function convertToPLN(amount, currency) {
	try {
		const exchangeRate = await getExchangeRate(currency);
		if (exchangeRate) {
			const result = amount * exchangeRate;
			return result.toFixed(2);
		} else {
			return 'Błąd podczas przeliczania waluty.';
		}
	} catch (error) {
		console.error(error);
	}
}

function createLoader() {
	const loader = document.createElement('div');
	loader.classList.add('loader');
	return loader;
}

const convertButton = document.getElementById('convertButton');
convertButton.addEventListener('click', async () => {
	const amount = amountInput.value;
	const currency = currencySelect.value;
	try {
		const result = await convertToPLN(amount, currency);
		console.log(`Wynik:${result} PLN`);
	} catch (error) {
		console.error(error);
	}
});
