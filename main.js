const fibForm = document.querySelector(".calculator"),
  fibInput = document.querySelector(".fibonacci-index-input"),
  fibOutput = document.querySelector(".fibonacci-number-output"),
  resultsElement = document.querySelector(".results"),
  resultSpinner = document.querySelector(
    ".results-container .spinner-container"
  ),
  sortBySelect = document.querySelector(".sort-by-select"),
  currSort = { by: "createdDate", order: -1 };

let results;

init();

fibForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fibForm.classList.add("was-validated");

  if (fibForm.checkValidity()) {
    handleSubmit();
  }
});

sortBySelect.addEventListener("change", (e) => {
  const newSort = JSON.parse(e.target.value);
  Object.assign(currSort, newSort);

  sortResults(currSort);
  showResults();
});

async function init() {
  await loadResults();
  sortResults(currSort);
  showResults();
}

async function handleSubmit() {
  const useServer = document.querySelector(".save-calculation").checked;

  resetOutput();
  fibOutput.classList.add("spinner-border");

  if (useServer) {
    await serverFibonacci(fibInput.value);
  } else {
    fibOutput.textContent = fibonacci(+fibInput.value);
  }

  fibOutput.classList.remove("spinner-border");

  if (useServer) {
    init();
  }
}

function resetOutput() {
  styleOutput(true);
  fibOutput.replaceChildren();
}

function fibonacci(index) {
  if (index <= 0) {
    return 0;
  }

  let prev = 0,
    curr = 1;

  for (let i = 2; i <= index; i++) {
    [prev, curr] = [curr, prev + curr];
  }

  return curr;
}

async function serverFibonacci(index) {
  try {
    fibOutput.textContent = await fetchFibonacci(index);
  } catch (error) {
    styleOutput(false);
    reportError(error);
  }
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
  resultSpinner.classList.remove("spinner-border");
}

function showResults() {
  resultsElement.replaceChildren();

  for (const result of results) {
    const resultElement = document.createElement("li");
    resultElement.classList.add("result", "list-group-item", "px-0");

    resultElement.innerHTML = `The Fibonnaci of <span class="fw-bold">${
      result.number
    }</span> is <span class="fw-bold">${
      result.result
    }</span>. Calculated at: ${new Date(result.createdDate)}`;

    resultsElement.append(resultElement);
  }
}

function sortResults(sort) {
  results.sort((a, b) => sort.order * (a[sort.by] - b[sort.by]));
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
