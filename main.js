const fibForm = document.querySelector(".calculator"),
  fibInput = document.querySelector(".fibonacci-index-input"),
  fibOutput = document.querySelector(".fibonacci-number-output"),
  resultsElement = document.querySelector(".results"),
  resultSpinner = document.querySelector(".results .spinner-container");

let results;
loadResults();

fibForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  fibForm.classList.add("was-validated");

  if (fibForm.checkValidity()) {
    handleSubmit();
  }
});

function handleSubmit() {
  styleOutput(true);
  fibOutput.replaceChildren();
  fibOutput.classList.add("spinner-border");

  fetchFibonacci(fibInput.value)
    .finally(() => {
      fibOutput.classList.remove("spinner-border");
    })
    .then((result) => {
      fibOutput.textContent = result;
      loadResults();
    })
    .catch((error) => {
      styleOutput(false);
      reportError(error);
    });
}

async function fetchFibonacci(index) {
  const response = await fetch(`http://localhost:5050/fibonacci/${index}`);

  if (!response.ok) {
    throw Error(await response.text());
  }

  return (await response.json()).result;
}

async function fetchResults() {
  const response = await fetch("http://localhost:5050/getFibonacciResults");

  return (await response.json()).results;
}

async function loadResults() {
  resultSpinner.classList.add("spinner-border");
  results = await fetchResults();

  for (const result of results) {
    const resultElement = document.createElement("div");
    resultElement.classList.add("result");
    resultElement.innerHTML = `The Fibonnaci of <span class="fw-bold">${
      result.number
    }</span> is <span class="fw-bold">${
      result.result
    }</span>. Calculated at: ${new Date(result.createdDate)}`;

    const hr = document.createElement("hr");

    resultsElement.append(resultElement, hr);
  }

  resultSpinner.classList.remove("spinner-border");
}

function reportError(error) {
  const errorElement = document.createElement("small");
  errorElement.textContent = "Server Error: " + error.message;
  fibOutput.append(errorElement);
}

function styleOutput(ok) {
  const currentStyles = fibOutput.classList,
    normalStyles = ["text-body", "text-decoration-underline", "fw-bold"],
    errorStyles = ["text-danger", "text-decoration-none", "fw-normal"];

  if (ok) {
    currentStyles.add(...normalStyles);
    currentStyles.remove(...errorStyles);
  } else {
    currentStyles.remove(...normalStyles);
    currentStyles.add(...errorStyles);
  }
}
