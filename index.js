const convertButton = document.getElementById('convertButton');
const amountInput = document.getElementById('amountInput');
const currencySelect = document.getElementById('currencySelect');
const resultParagraph = document.getElementById('resultOutput');
const errorMessage = document.getElementById('error-message');

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
			throw new Error('Wartość musi być dodatnia');
		}
		const exchangeRate = await getExchangeRate(currency);
		const result = amount * exchangeRate;
		return result.toFixed(2);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

function displayError(message) {
	errorMessage.textContent = message;
	errorMessage.style.display = 'block';
}

function hideError() {
	errorMessage.style.display = 'none';
}

amountInput.addEventListener('input', () => {
	const amount = parseFloat(amountInput.value);
	if (amount <= 0) {
		resultParagraph.textContent = '';
		hideError();
	}
});

convertButton.addEventListener('click', async () => {
	const amount = parseFloat(amountInput.value);
	const currency = currencySelect.value;

	hideError(); // Ukrywamy komunikat o błędzie przed każdym przeliczeniem

	try {
		if (amount <= 0) {
			throw new Error('Wartość musi być dodatnia');
		}

		const result = await convertToPLN(amount, currency);
		resultParagraph.textContent = `${result} PLN`;
	} catch (error) {
		displayError(error.message);
	}
});
