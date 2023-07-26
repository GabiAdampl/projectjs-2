const convertButton = document.getElementById('convertButton');
const amountInput = document.getElementById('amountInput');
const currencySelect = document.getElementById('currencySelect');
const resultParagraph = document.getElementById('resultOutput');

async function getExchangeRate(currency) {
	try {
		if (!currency) {
			throw new Error('Waluta nie została wybrana.');
		}
		const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;
		const response = await fetch(url);
		const data = await response.json();
		return data.rates[0].mid;
	} catch (error) {
		console.error(`Nie udało się pobrać kursu waluty. Błąd: ${error}`);
		throw error;
	}
}

async function convertToPLN(amount, currency) {
	try {
		if (!amount || amount <= 0) {
			throw new Error('Kwota musi być większa od zera.');
		}
		const exchangeRate = await getExchangeRate(currency);
		const result = amount * exchangeRate;
		return result.toFixed(2);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

convertButton.addEventListener('click', async () => {
	const amount = parseFloat(amountInput.value);
	const currency = currencySelect.value;
	try {
		const result = await convertToPLN(amount, currency);
		resultParagraph.innerHTML = `${result} PLN`;
	} catch (error) {
		resultParagraph.innerHTML = 'Błąd podczas przeliczania waluty.';
	}
});
