const requestOptions = {
  method: "GET",
  redirect: "follow"
};

let maindiv = document.querySelector(".main-container");

let innerdiv = document.createElement("div");
innerdiv.classList.add("InnerDiv");

// Heading
let head = document.createElement("h2");
head.classList.add("heading");
head.innerText = "Currency Converter";
innerdiv.appendChild(head);

// Amount input
let amount = document.createElement("input");
amount.setAttribute("type", "number");
amount.setAttribute("required", "true");
amount.setAttribute("placeholder", "Enter Amount");
innerdiv.appendChild(amount);

// From select
let fromSelect = document.createElement("select");
innerdiv.appendChild(fromSelect);

// To select
let toSelect = document.createElement("select");
innerdiv.appendChild(toSelect);

// Convert button
let convertBtn = document.createElement("button");
convertBtn.innerText = "Convert";
innerdiv.appendChild(convertBtn);

// Result div
let resultDiv = document.createElement("div");
resultDiv.classList.add("result");
innerdiv.appendChild(resultDiv);

// Add innerdiv to DOM at end — after setup
maindiv.appendChild(innerdiv);

// Fetch currencies (initially from USD)
fetch("https://api.exchangerate-api.com/v4/latest/USD", requestOptions)
  .then(response => response.json())
  .then(result => {
    let rates = result.rates;

    for (let currency in rates) {
      let option1 = document.createElement("option");
      option1.value = currency;
      option1.text = currency;
      fromSelect.appendChild(option1);

      let option2 = document.createElement("option");
      option2.value = currency;
      option2.text = currency;
      toSelect.appendChild(option2);
    }

    // Set defaults after options loaded
    fromSelect.value = "USD";
    toSelect.value = "INR";
  })
  .catch(error => console.error("Currency list fetch error:", error));

// Convert button handler
convertBtn.addEventListener("click", () => {
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;
  const amountValue = parseFloat(amount.value);

  if (!amountValue || amountValue <= 0) {
    resultDiv.innerText = "Please enter a valid amount.";
    return;
  }

  console.log(`Converting ${amountValue} ${fromCurrency} to ${toCurrency}`);

  fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const rate = data.rates[toCurrency];

      if (!rate) {
        resultDiv.innerText = `Exchange rate for ${toCurrency} not available.`;
        return;
      }

      const convertedAmount = (amountValue * rate).toFixed(2);
      resultDiv.innerText = `${amountValue} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    })
    .catch(error => {
      resultDiv.innerText = "Error fetching conversion rate.";
      console.error("Conversion fetch error:", error);
    });
});
